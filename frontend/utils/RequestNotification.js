import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import API from '../api';
import Toast from 'react-native-toast-message';



const registerForPushNotificationsAsync = async (userId) => {
  if (!Constants.isDevice) {
    console.log('Must use physical device for push notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;

  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission denied');
    return; 
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData?.data;

    if (!token) {
      console.log("No token received");
      Toast.show({ type: 'error', position: 'bottom', text1: 'Push Token Error', text2: 'No token received', visibilityTime: 4000, autoHide: true, bottomOffset: 60});
      return; 
    }

    await API.post('/api/user/saveExpoToken', { user_id: userId, expoPushToken: token });
    console.log('Token saved successfully');
    Toast.show({ type: 'success', position: 'bottom', text1: 'Token saved successfully', text2: 'No token received', visibilityTime: 4000, autoHide: true, bottomOffset: 60});

  } 


  catch (error) {
    console.log('Failed to register push token:', error);
    Toast.show({ type: 'error', position: 'bottom', text1: 'Push Token Error', text2: error.message, visibilityTime: 4000, autoHide: true, bottomOffset: 60});

  }


};



export default registerForPushNotificationsAsync;
