import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import API from '../api';



const registerForPushNotificationsAsync = async (userId) => {
    if (!Constants.isDevice) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (finalStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('Notification permission denied');
        return;
    }

    try {
        const token = (await Notifications.getExpoPushTokenAsync()).data;

        await API.post('/api/disaster/save-expo-token', { user_id: userId, expoPushToken: token });

        console.log('Push token saved:', token);
    } 
    
    catch (error) {
        console.error('Failed to register push token:', error);
    }


};

export default registerForPushNotificationsAsync;
