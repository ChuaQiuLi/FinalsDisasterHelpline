import React, { useState, useEffect } from 'react';
import { View, Text, TouchableHighlight, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { lightStyles, darkStyles } from '../styles/QuizScreenStyle.js';
import Toast from 'react-native-toast-message';
import API from '../api';


const QuizScreen= () => {
    const { isDarkMode } = useTheme(); 
    const styles = isDarkMode ? darkStyles : lightStyles; 
    const userId = useSelector((state) => state.auth.user?.id);
    const navigation = useNavigation();





};



export default QuizScreen;