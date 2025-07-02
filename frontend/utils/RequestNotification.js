import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import API from '../api';
import Toast from 'react-native-toast-message';



const usePushNotificationManager = (userId) => {
  const appState = useRef(AppState.currentState);
  const [expoPushToken, setExpoPushToken] = useState(null);

  const registerForPushNotificationsAsync = async () => {
    if (!Constants.isDevice) {
      console.log('Must use physical device for push notifications');
      return null;
    }

    // Create Android notification channel before requesting permission
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

    }

    // Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Set foreground handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),

    });

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId || '23397003-7cc7-4733-a3eb-d5549ac58eb7',
      });

      return tokenData?.data ?? null;
    } 
    
    catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
      
    }

  };

  const checkAndUpdateToken = async () => {
    if (!userId) return;

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      setExpoPushToken(null);
      return;
    }

    const newToken = await registerForPushNotificationsAsync();
    if (!newToken) return;

    if (newToken !== expoPushToken) {
      setExpoPushToken(newToken);
      await API.post('/api/user/saveExpoToken', { user_id: userId, expoPushToken: newToken });

      console.log('Expo push token saved:', newToken);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Push token updated',
        visibilityTime: 3000,
        bottomOffset: 60,
      });

    }

  };

  // Run on first load and when app comes back to foreground
  useEffect(() => {
    // Initial check
    checkAndUpdateToken(); 

    const subscription = AppState.addEventListener('change', (nextState) => {
      if ( appState.current.match(/inactive|background/) && nextState === 'active' ) {
        checkAndUpdateToken(); 
      }

      appState.current = nextState;

    });

    return () => subscription.remove();

  }, [userId]);

  return expoPushToken;

};

export default usePushNotificationManager;
