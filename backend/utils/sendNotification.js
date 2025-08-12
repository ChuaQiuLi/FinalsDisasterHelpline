const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

async function sendPushNotification(expoPushToken, message) {
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`Invalid Expo push token: ${expoPushToken}`);
    return;

  }

  const messages = [{
    to: expoPushToken,
    sound: 'default',
    title: message.title,
    body: message.body,
    data: message.data || {},

  }];

  
  const chunks = expo.chunkPushNotifications(messages);

  try {
    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk, { useFcmV1: true });
      console.log('Push notification ticket:', ticketChunk);
    }

  } 
  
  catch (error) {
    console.error('Error sending push notification:', error);
  }

}

module.exports = { sendPushNotification };
