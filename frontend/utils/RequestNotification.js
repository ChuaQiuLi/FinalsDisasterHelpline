import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import API from '../api';
import Toast from 'react-native-toast-message';


const registerForPushNotificationsAsync = async (userId) => {
    if (!Constants.isDevice) {
        console.log('Must use physical device for push notifications');
        return;
    }

    // checks if permission has already been granted
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // prompts the user for permission
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
        console.log("Token data:", tokenData);
        const token = tokenData?.data;

        if (!token) throw new Error("No token received");

        const res = await API.post('/api/user/saveExpoToken', { user_id: userId, expoPushToken: token });

        console.log('Token saved successfully:', res.data);
    } 
    
    catch (error) {
        console.log('Failed to register push token:', error);
        Toast.show({ type: 'error', text1: 'Push Token Error', text2: error.message });

    }
};


export default registerForPushNotificationsAsync;
