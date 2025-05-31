// SplashScreen.js
import React from 'react';
import { View, Image } from 'react-native';
import { lightStyles, darkStyles } from '../styles/SplashScreenStyle'
import { useTheme } from '../context/ThemeContext'; 

const SplashScreen = () => {
  const { isDarkMode } = useTheme(); 
  const styles = isDarkMode ? darkStyles : lightStyles; 

  const logoSource = isDarkMode
  ? require('../assets/icon.png')
  : require('../assets/icon.png');



  return (
    <View style={styles.container}>
      <Image
        source={logoSource} 
        style={styles.icon}
      />
    </View>
  );
};



export default SplashScreen;
