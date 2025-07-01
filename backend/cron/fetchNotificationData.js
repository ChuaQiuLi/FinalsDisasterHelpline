const cron = require('node-cron');
const crypto = require('crypto');
const fetchGDACSData = require('../utils/fetchDisaster');
const { sendPushNotification } = require('../utils/sendNotification');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


cron.schedule('*/30 * * * *', async () => {
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
      const userCountryLower = user.country.toLowerCase();

      // Filter disasters that mention the user's country
      const matchingDisasters = disasters.filter(dis =>
        dis.description && dis.description.toLowerCase().includes(userCountryLower)
      );

      for (const dis of matchingDisasters) {
        console.log('dis.id:', dis.id, 'type:', typeof dis.id);
        console.log('dis.eventId:', dis.eventId, 'type:', typeof dis.eventId);

        // Generate a unique ID for the disaster
        const disasterId = dis.id || dis.eventId || crypto.createHash('md5').update(dis.description + dis.eventType).digest('hex');


        // Check DB if notification was already sent
        const alreadySent = await prisma.disasterNotificationLog.findFirst({
          where: {
            userId: user.user_id,
            notification_disaster_id: disasterId
          }

        });

        if (alreadySent) {
          // Skip if already notified
          continue;
        }

        // Send push notification
        await sendPushNotification(user.expoPushToken, {
          title: `Disaster Alert: ${dis.eventType}`,
          body: dis.title

        });

        // Save record to DB
        await prisma.disasterNotificationLog.create({
          data: {
            userId: user.user_id,
            notification_disaster_id: disasterId

          }

        });

        console.log(`Sent disaster notification to user ${user.user_id} for disaster ${disasterId}`);
      }

    }

  } 
  
  catch (error) {
    console.error('Error in disaster push cron:', error);
  }


});
