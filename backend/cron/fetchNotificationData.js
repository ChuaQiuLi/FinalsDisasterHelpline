const cron = require('node-cron');
const crypto = require('crypto');
const fetchGDACSData = require('../utils/fetchDisaster');
const { sendExpoPushNotification, sendFirebasePushNotification } = require('../utils/sendNotification');


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


cron.schedule('*/30 * * * *', async () => {
  try {
    console.log('Running disaster notification cron job...');

    const disasters = await fetchGDACSData();

    
    // Users with country
    const usersWithCountry = await prisma.user.findMany({
      where: {
        country: { not: null },
        expoPushToken: { not: null }
      },

      select: {
        user_id: true,
        country: true,
        expoPushToken: true,
        firebaseToken: true,
      }

    });


    
    // Users without country - global notification
    const usersWithoutCountry = await prisma.user.findMany({
      where: {
        country: null,
        expoPushToken: { not: null }
      },

      select: {
        user_id: true,
        expoPushToken: true,
        firebaseToken: true,
      }

    });
    
    
    // Handle users with country
    for (const user of usersWithCountry) {
      const userCountryLower = user.country.toLowerCase();

      // Filter disasters that mention the user's country
      const matchingDisasters = disasters.filter(dis =>
        dis.description && dis.description.toLowerCase().includes(userCountryLower)
      );

      await handleDisastersForUser(user, matchingDisasters);

    }


    // Handle users without country (receive all disasters)
    for (const user of usersWithoutCountry) {
      await handleDisastersForUser(user, disasters);
    }

  }


  catch (error) {
    console.error('Error in disaster push cron:', error);
  
  }

});


async function handleDisastersForUser(user, disastersToCheck) {
  for (const dis of disastersToCheck) {

    // Generate a unique ID for the disaster
    const disasterId = dis.id || dis.eventId || crypto.createHash('md5').update(dis.description + dis.eventType).digest('hex');

    // Avoid duplicate notifications
    const alreadySent = await prisma.disasterNotificationLog.findFirst({
      where: {
        user_id: user.user_id,
        notification_disaster_id: disasterId

      }

    });

    if (alreadySent) continue;

    const message = {
      title: `Disaster Alert: ${dis.eventType}`,
      body: dis.title,

    };

    if (user.expoPushToken) {
      await sendExpoPushNotification(user.expoPushToken, message);
    } 
    
    else if (user.firebaseToken) {
      await sendFirebasePushNotification(user.firebaseToken, message);
    } 
    
    else {
      console.log(`No push token for user ${user.user_id}, skipping notification.`);
    }


    // Log notification
    await prisma.disasterNotificationLog.create({
      data: {
        user_id: user.user_id,
        notification_disaster_id: disasterId
      }

    });

    console.log(`Sent disaster notification to user ${user.user_id} for disaster ${disasterId}`);

  }


}






