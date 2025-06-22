// cron/sendPushOnMatch.js
const cron = require('node-cron');
const crypto = require('crypto');
const fetchGDACSData = require('../utils/fetchDisaster');
const { sendPushNotification } = require('../utils/sendNotification');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// In-memory cache to track sent notifications
// Structure: { [userId]: { [disasterId]: timestampSent } }
const sentNotificationsCache = {};
// 1 hour
const CACHE_EXPIRY_MS = 1000 * 60 * 60; 



cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Running disaster notification cron job...');

    const disasters = await fetchGDACSData();

    // Fetch users with country and expoPushToken set
    const users = await prisma.user.findMany({ 
      where: { 
        country: { not: null },
        expoPushToken: { not: null }
      },

      select: {
        user_id: true,
        country: true,
        expoPushToken: true,
      }

    });

    for (const user of users) {
      if (!user.country) continue;

      const userCountryLower = user.country.toLowerCase();

      // Filter disasters by matching disaster description with user country 
      const matchingDisasters = disasters.filter(dis => 
        dis.description && dis.description.toLowerCase().includes(userCountryLower)
      );


      for (const dis of matchingDisasters) {
        // Generate unique disaster ID if none provided
        const disasterId = dis.id || dis.eventId || crypto.createHash('md5')
          .update(dis.description + dis.eventType)
          .digest('hex');

        // Initialize cache for user if missing
        if (!sentNotificationsCache[user.user_id]) {
          sentNotificationsCache[user.user_id] = {};
        }

        const lastSent = sentNotificationsCache[user.user_id][disasterId];


        // Skip if sent within cache expiry period
        if (lastSent && (Date.now() - lastSent) < CACHE_EXPIRY_MS) {
          continue;
        }

        // Send push notification
        if (user.expoPushToken) {
          await sendPushNotification(user.expoPushToken, {
            title: `Disaster Alert: ${dis.eventType}`,
            body: dis.title,

          });

          // Mark notification as sent with timestamp
          sentNotificationsCache[user.user_id][disasterId] = Date.now();
          console.log(`Sent disaster notification to user ${user.user_id} for disaster ${disasterId}`);
        }

      }

    }

    // Clean up expired cache entries
    for (const userId in sentNotificationsCache) {
      for (const disasterId in sentNotificationsCache[userId]) {
        if ((Date.now() - sentNotificationsCache[userId][disasterId]) > CACHE_EXPIRY_MS) {
          delete sentNotificationsCache[userId][disasterId];
        }

      }

      // Remove user if no disasters left
      if (Object.keys(sentNotificationsCache[userId]).length === 0) {
        delete sentNotificationsCache[userId];
      }

    }

  } 
  
  catch (error) {
    console.error('Error in disaster push cron:', error);
  }


});



