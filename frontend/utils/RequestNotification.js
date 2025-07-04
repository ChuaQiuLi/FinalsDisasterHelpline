import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import API from '../api';




const usePushNotificationManager = (userId) => {
  const appState = useRef(AppState.currentState);
  const lastCheck = useRef(0);
  const [expoPushToken, setExpoPushToken] = useState(null);


  // Check permission & update token
  const checkAndUpdateToken = async () => {
    if (!userId) {
      return;

    }

    const hasPermission = await requestNotificationPermissions();

    if (!hasPermission) {
      console.log('Notification permission not granted — skipping token generation.');
      
      
      if (expoPushToken !== null) {
        setExpoPushToken(null);

        // Tell backend to remove or clear this user's token
        try {
          await API.post('/api/user/saveExpoToken', { user_id: userId, expoPushToken: null });
          console.log('Cleared Expo push token on backend due to permission denied.');
        } 
        
        catch (err) {
          console.log('Failed to clear Expo token:', err);
        }

      }

      return;


    }

  
    const newToken = await registerForPushNotificationsAsync();

    if (!newToken) {
      console.log('Failed to generate Expo push token.');
      return;

    }


    if (newToken !== expoPushToken) {
      setExpoPushToken(newToken);

      try {
        await API.post('/api/user/saveExpoToken', { user_id: userId, expoPushToken: newToken });
        console.log('Expo push token saved to database:', newToken);
      }

      catch (error) {
        console.log('Failed to save Expo push token:', error);

      }

    }

  };


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


  
  // Run on mount & when app returns to foreground
  useEffect(() => {
    // on initial load
    checkAndUpdateToken(); 

    // 5 seconds cooldown
    const MIN_INTERVAL = 5000; 


    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const now = Date.now();
        if (now - lastCheck.current > MIN_INTERVAL) {
          lastCheck.current = now;
          console.log('App returned to foreground — checking token.');
          checkAndUpdateToken().catch((err) => console.log('Token check failed:', err));

        }

      }

      appState.current = nextAppState;

    });

    return () => subscription.remove();

  }, [userId]);

    
  
  // Create Android notification channel on app start
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',

      }).then(() => {
        console.log('Notification channel created');

      }).catch((err) => {
        console.log('Failed to create notification channel:', err);

      });
      
    }

    else {
      console.log('Not Android platform — skipping notification channel creation');
    }
    
  }, []);



  // Request notification permission
  const requestNotificationPermissions = async () => {

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('Existing notification permission status:', existingStatus);

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }

      return true;

    }

    catch (error) {
      console.log('Permission request failed:', error);
      return false;
    }

    
  };


  // Register device & get token
  const registerForPushNotificationsAsync = async () => {
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      
      if (!projectId) {
        console.log('Project ID not found. Make sure EAS is configured properly.');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });

      if (!tokenData?.data) {
        console.log('Push token not returned.');
        return null;
      }

      console.log('Generated push token:', tokenData?.data);

      return tokenData.data;

    }

    catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;

    }


  };


};

export default usePushNotificationManager;
