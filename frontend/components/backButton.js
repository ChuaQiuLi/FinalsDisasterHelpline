import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { lightStyles, darkStyles } from '../styles/BackButtonStyle'; 
import { useTheme } from '../context/ThemeContext'; 



const BackButton = ({ onPress }) => {
  const [isPressed, setIsPressed] = useState(false);
  const { isDarkMode } = useTheme(); 
  const styles = isDarkMode ? darkStyles : lightStyles; 

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={styles.button}
    >
      {isPressed && <View style={styles.pressableCircle} />}
      <Ionicons name="arrow-back" size={23} style={styles.icon} />
    </Pressable>

  );

};


export default BackButton;