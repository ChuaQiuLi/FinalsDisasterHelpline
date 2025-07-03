const { Expo } = require('expo-server-sdk');
const admin = require('./firebase');

// Create a new Expo SDK client
const expo = new Expo();



// ios device 
async function sendExpoPushNotification(expoPushToken, message) {
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
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log('Push notification ticket:', ticketChunk);
    }

  } 
  
  catch (error) {
    console.error('Error sending push notification:', error);
  }

}


// for android device
async function sendFirebasePushNotification(firebaseToken, message) {
  if (!firebaseToken) {
    console.error('Missing Firebase token');
    return;
  }

  const messagePayload = {
    token: firebaseToken,
    notification: {
      title: message.title,
      body: message.body,
    },

    data: message.data || {},

  };

  try {
    const response = await admin.messaging().send(messagePayload);
    console.log('Firebase push notification sent:', response);
  } 
  
  catch (error) {
    console.error('Error sending Firebase push notification:', error);
  }

}



module.exports = { sendExpoPushNotification, sendFirebasePushNotification };