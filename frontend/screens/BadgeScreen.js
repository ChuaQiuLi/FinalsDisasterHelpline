import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { lightStyles, darkStyles } from '../styles/BadgeScreenStyle';
import API from '../api';


// Import components
import BackButton from '../components/BackButton';


const BadgeScreen = () => {
    const { isDarkMode } = useTheme();
    const styles = isDarkMode ? darkStyles : lightStyles;
    const navigation = useNavigation();
    const userId = useSelector((state) => state.auth.user?.id);
    const [badges, setBadge] = useState([]);
    const [loading, setLoading] = useState(true);
    


    const badgeImages = {
        'earthquake_quiz': require('../assets/earthquake_badge.png'),
        'earthquake_quiz_outline': require('../assets/earthquake_badge_outline.png'),
        'flood_quiz': require('../assets/flood_badge.png'),
        'flood_quiz_outline': require('../assets/flood_badge_outline.png'),
        'drought_quiz': require('../assets/drought_badge.png'),
        'drought_quiz_outline': require('../assets/drought_badge_outline.png'),
        'forest_fire_quiz': require('../assets/forest_fire_badge.png'),
        'forest_fire_quiz_outline': require('../assets/forest_fire_badge_outline.png'),
        'tropical_cyclone_quiz': require('../assets/tropical_cyclone_badge.png'),
        'tropical_cyclone_quiz_outline': require('../assets/tropical_cyclone_badge_outline.png'),
        'tsunami_quiz': require('../assets/tsunami_badge.png'),
        'tsunami_quiz_outline': require('../assets/tsunami_badge_outline.png'),
        'volcano_quiz': require('../assets/volcano_badge.png'),
        'volcano_quiz_outline': require('../assets/volcano_badge_outline.png'),
        'checklist': require('../assets/checklist.png'),
        'checklist_outline': require('../assets/checklist_outline.png')

    };


    useEffect(() => {
        fetchUserBadge();

    }, []);


    const fetchUserBadge = async () => {
        setLoading(true);

        try {
            const response = await API.get('/api/badge/user-badge', { params: { user_id: userId } });
            setBadge(response.data);

        }

        catch (error) {
            console.error('Error fetching badge:', error);
            Alert.alert('Failed to fetch badge. Please try again later.');
        }

        finally {
            setLoading(false);
        }


    };


    const renderBadgeItem = ({ item }) => {

        // Check if the user has earned this badge
        const earned = item.userBadge.length > 0;
        // Choose the image key: use the filled image if earned, otherwise use the outline version
        const imageKey = earned ? item.badge_image_filled : item.badge_image_outline;
        // Get the actual image from the badgeImages
        const imageSource = badgeImages[imageKey];

        return (
            <View style={styles.badgeItem}>
                <Image source={imageSource} style={styles.badgeImage} />
                <Text style={styles.badgeTitle}>{item.badge_name.replace('_', ' ')}</Text>
                <Text style={styles.badgeDescription}>{item.description}</Text>
                <Text style={styles.badgeCriteria}>{item.criteria}</Text>
            </View>

        );

    };


      if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDarkMode ? '#ffffff' : '#000000'} />
            <Text style={styles.loadingText}>Loading Checklist...</Text>
          </View>
        );
    
      }
    
      


    const previousPage = () => {
        navigation.goBack();

    }
      


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton onPress={previousPage} />
                <Text style={styles.title}>Badges</Text>
                
            </View>

            <FlatList
                data={badges}
                keyExtractor={(item) => item.badge_id.toString()}
                renderItem={renderBadgeItem}
            />

        </SafeAreaView>
    );


};



export default BadgeScreen;