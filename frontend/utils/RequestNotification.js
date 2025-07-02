import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import API from '../api';
import Toast from 'react-native-toast-message';


const usePushNotificationManager = (userId) => {
  const appState = useRef(AppState.currentState);
  const [expoPushToken, setExpoPushToken] = useState(null);

  // Set foreground notification behavior
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);


  // Request notification permission
  const requestNotificationPermissions = async () => {
    let { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Existing notification permission status:', existingStatus);

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      existingStatus = status;
    }

    return existingStatus === 'granted';

  };

  // Register device & get token
  const registerForPushNotificationsAsync = async () => {
    if (!Constants.isDevice) {
      console.log('Must use physical device for push notifications');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
      
    });

    console.log('Generated push token:', tokenData.data);
    return tokenData.data;

  };

  // Check permission & update token
  const checkAndUpdateToken = async () => {
    if (!userId) return;

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permission not granted — skipping token generation.');
      setExpoPushToken(null);
      return;

    }

    const newToken = await registerForPushNotificationsAsync();
    if (!newToken) return;

    if (newToken !== expoPushToken) {
      setExpoPushToken(newToken);
      await API.post('/api/user/saveExpoToken', {
        user_id: userId,
        expoPushToken: newToken,
      });

      console.log('Expo push token saved to database:', newToken);

      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Push notifications enabled',
        visibilityTime: 3000,
        bottomOffset: 60,
      });

    }
    
  };

  // Run on mount & when app returns to foreground
  useEffect(() => {
    // on initial load

    checkAndUpdateToken(); 

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has returned to foreground — rechecking push token.');
        checkAndUpdateToken();
      }

      appState.current = nextAppState;

    });

    return () => subscription.remove();

  }, [userId]);

  return expoPushToken;

};

export default usePushNotificationManager;
