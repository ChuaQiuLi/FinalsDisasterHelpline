import React, { useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightStyles, darkStyles } from '../styles/ForgetPasswordScreenStyle';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import API from '../api';



const ForgetPasswordScreen = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const { isDarkMode } = useTheme();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const styles = isDarkMode ? darkStyles : lightStyles;
    const verifyEmailButtonDisabled = !email.trim();
    const verifyCodeButtonDisabled = !resetCode.trim();
    const passwordButtonDisabled = !newPassword.trim() || !confirmNewPassword.trim();



    // Determine the logo source based on the theme
    const logoSource = isDarkMode ? require('../assets/icon_dark.png') : require('../assets/icon_light.png');


    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const commonWords = ["password", "123456", "12345678", "qwerty", "abc123"];
        const isCommon = commonWords.some(word => password.toLowerCase().includes(word));

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars && !isCommon;
    
    };

    const handleEmailVerification = async () => {

        setIsSendingCode(true);

        const trimmedEmail = email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!trimmedEmail) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        else if (!emailRegex.test(trimmedEmail)) {
            Alert.alert('Error', 'Invalid email format!');
            return;
        }
        

        try {

            const response = await API.post('/api/user/request-reset', { email: trimmedEmail });

            if (response.status === 200) {
                Alert.alert('Success', 'A reset code has been sent to your email.');
                setStep(2);
            } 
            
            else {
                Alert.alert('Error', 'Failed to send reset code. Please try again.');
            }
        } 
        
        catch (error) {
            Alert.alert('Error', 'Failed to send reset code. Please try again.');
            console.error('Error sending reset code:', error);
        }

        setIsSendingCode(false);

    };


    const handleCodeVerification = async () => {

        setIsVerifyingCode(true);

        const trimmedEmail = email.trim();
        const trimmedResetCode = resetCode.trim();

        try {
            
            const response = await API.post('/api/user/verify-code', { email: trimmedEmail, resetCode: trimmedResetCode });

            const data = response.data;
            

            if (response.status === 200) {
                setStep(3); // Move to the next step
            } 
            
            else {
                console.log('Error:', data.message);
                Alert.alert('Error', data.message || 'Invalid reset code. Please try again.');
            }
        } 
        
        catch (error) {
            console.error('Error verifying reset code:', error);
            Alert.alert('Error', 'Failed to verify reset code. Please try again.');
        }

        setIsVerifyingCode(false);

    };


    const handlePasswordReset = async () => {

        setIsResettingPassword(true);

        const trimmedNewPassword = newPassword.trim();
        const trimmedConfirmNewPassword = confirmNewPassword.trim();

        if (trimmedNewPassword !== trimmedConfirmNewPassword) {
            Alert.alert('Error', 'Passwords do not match!');
            setIsResettingPassword(false);
            return;
        }

        if (!validatePassword(trimmedNewPassword) || !validatePassword(trimmedConfirmNewPassword)) {
            Alert.alert('Error', 'Password must be at least 8 characters long, and must contain 1 of upper and lower case letters, numbers, and special characters (e.g., @, #, $, %)');
            setIsResettingPassword(false);
            return;
        }

        try {
            const response = await API.post('api/user/reset-password', { email: email.trim(), newPassword: trimmedNewPassword });
            if (response.status === 200) {
                Alert.alert('Success', 'Your password has been reset successfully!');
                
                // Clear form state
                setEmail('');
                setResetCode('');
                setNewPassword('');
                setConfirmNewPassword('');
                setStep(1);
                
                navigation.navigate('Login');

            } 
            
            else {
                Alert.alert('Error', response.data.message);
            }

        } 
        
        catch (error) {
            console.error('Error resetting password:', error);
            Alert.alert('Error', 'Failed to reset password');
        }


        setIsResettingPassword(false);

    };



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.logoContainer}>
                    <Image
                        source={logoSource}
                        style={styles.logo}
                    />
                </View>

                {step === 1 ? (
                    <>
                        <View style={styles.inputContainer}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Forget Password</Text>
                            </View>
                            
                            <Text>Enter the email address associated with your account and we'll send you a code to reset your password.</Text>
                            <Text style={styles.label}>Email</Text>
                            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" cursorColor="#000000" />
                        
                        </View>
                        
                        <TouchableHighlight style={[styles.button, (verifyEmailButtonDisabled || isSendingCode) && styles.verifyEmailButtonDisabled ]} underlayColor={isDarkMode ? '#999999' : '#999999'} onPress={handleEmailVerification} >
                            <Text style={styles.buttonText}>{isSendingCode ? 'Sending code...' : 'Send Code'}</Text>
                        </TouchableHighlight>

                    </>
                    
                ) : step === 2 ? (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.infoText}> We sent a code to <Text style={styles.boldText}>{email}</Text>. </Text>
                            <Text style={styles.label}>Reset Code</Text>
                            <TextInput style={styles.input} placeholder="Enter reset code" value={resetCode} onChangeText={setResetCode} maxLength={6} cursorColor="#000000" />
                        </View>

                        <TouchableHighlight style={[styles.button, (verifyCodeButtonDisabled || isVerifyingCode) && styles.verifyCodeButtonDisabled ]} underlayColor={isDarkMode ? '#999999' : '#999999'} onPress={handleCodeVerification} >
                            <Text style={styles.buttonText}>{isVerifyingCode ? 'Verifying...' : 'Continue'}</Text>
                        </TouchableHighlight>

                    </>
                    
                ) : (

                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput style={styles.input} placeholder="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry={!showNewPassword} cursorColor="#000000" />
                                
                                <TouchableHighlight style={styles.icon} onPress={() => setShowNewPassword(!showNewPassword)} underlayColor={isDarkMode ? '#999999' : '#999999'} >
                                    <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={24} />
                                </TouchableHighlight>

                            </View>

                            <Text style={styles.label}>Confirm New Password</Text>
                            <View style={styles.passwordContainer}>
                            
                            <TextInput style={styles.input} placeholder="Confirm New Password" value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry={!showConfirmPassword} cursorColor="#000000" />
                            
                            <TouchableHighlight style={styles.icon} onPress={() => setShowConfirmPassword(!showConfirmPassword)} underlayColor={isDarkMode ? '#999999' : '#999999'} >
                                <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24}/>
                            </TouchableHighlight>

                        </View>

                    </View>

                    <TouchableHighlight style={[styles.button, (passwordButtonDisabled || isResettingPassword) && styles.passwordButtonDisabled ]} underlayColor={isDarkMode ? '#999999' : '#999999'} onPress={handlePasswordReset} >
                        <Text style={styles.buttonText}>{isResettingPassword ? 'Resetting...' : 'Reset Password'}</Text>
                    </TouchableHighlight>
                </>
                
            )}

            </ScrollView>

        </SafeAreaView>
    );
    
};



export default ForgetPasswordScreen;
