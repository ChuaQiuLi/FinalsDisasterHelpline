import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableHighlight, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { lightStyles, darkStyles } from '../styles/EmergencyContactScreenStyle';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import API from '../api';



function EmergencyContactScreen() {
    // Dark or light theme
    const { isDarkMode } = useTheme();
    const styles = isDarkMode ? darkStyles : lightStyles;
    const userId = useSelector(state => state.auth.user.id);
    const [userCountryEmergContact, setuserCountryEmergContact] = useState([]);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [searched, setSearched] = useState(false);


    useEffect(() => {
        fetchUserCountryEmergContact();

    }, []);



    const fetchUserCountryEmergContact = async () => {
        
        try {
            const response = await API.get('/api/contact/user/country', { params: { user_id: userId } });
            setuserCountryEmergContact(response.data);
        }

        catch (error) {
            if (error.response && error.response.status === 400) {
                // Handle the 400 error response
                // Invalid user ID
                Alert.alert('Error', error.response.data.error);
            }

            else {
                console.error('Error fetching emergency contact:', error);
                Alert.alert('Failed to fetch emergency contact. Please try again later.');

            }

        }

    };


    const fetchSuggestions = async () => {
        if (query.length < 2) {
            setSuggestions([]);
            setSearched(false);
            return;
        }

        try {
            const response = await API.get(`/api/contact/countries?search=${query}`);
            setSuggestions(response.data);
            setSearched(true);
        }

        catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
            setSearched(true);
        }

    };


    const fetchCountryDetails = async (country_id) => {

        try {
            const response = await API.get(`/api/contact/countries/${country_id}/contacts`);
            setSelectedCountry(response.data);
            // Hide suggestions after selection
            setSuggestions([]);
            // Update input with selected country
            setQuery(response.data.country_name);
            setSearched(false);

        }

        catch (error) {
            console.error('Error fetching country emergency contact:', error);
            setSuggestions([]);
        }

    };



    const renderItem = ({ item }) => (
        <TouchableHighlight onPress={() => fetchCountryDetails(item.country_id)} underlayColor={isDarkMode ? '#999999' : '#999999'}>
            <View style={styles.item}>
                <Text style={styles.searchItem}>{item.country_name}</Text>
            </View>
        </TouchableHighlight>


    );


    if (userCountryEmergContact.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>{userCountryEmergContact.country_name} Emergency Contact</Text>
            </View>

            <View>
                <Text style={styles.noContact}>No emergency contact found</Text>
            </View>

            </SafeAreaView>


        );

    }



    return (
        <SafeAreaView style={styles.container}>
            {/* User country emergency contact and safety guidelines */}
            <View style={styles.innerContainer}>
                <Text style={styles.title}>{userCountryEmergContact.country_name} Emergency Contact</Text>

                {userCountryEmergContact.emergencyContact?.length > 0 && (
                    <>
                        <Text style={styles.contactText}>Description: {userCountryEmergContact.emergencyContact[0].description}</Text>
                        <Text style={styles.contactText}>Police: {userCountryEmergContact.emergencyContact[0].police} </Text>
                        <Text style={styles.contactText}>Fire: {userCountryEmergContact.emergencyContact[0].fire}</Text>
                        <Text style={styles.contactText}>Medical: {userCountryEmergContact.emergencyContact[0].medical}</Text>
                        <Text style={styles.safetyGuidelineTitle}>{userCountryEmergContact.country_name} Safety Guidlines</Text>
                        <Text style={styles.safetyGuidelineText}>{userCountryEmergContact.emergencyContact[0].safety_guidelines}</Text>

                    </>

                )}


                <View style={styles.searchContainer}>
                    <TextInput style={styles.searchInput} placeholder="Search Country" value={query} onChangeText={setQuery} placeholderTextColor={isDarkMode ? '#888888' : '#888888'} />
                    <TouchableHighlight onPress={fetchSuggestions} underlayColor={isDarkMode ? '#999999' : '#999999'}>
                        <Ionicons name="search-outline" size={14} color="black" />
                    </TouchableHighlight>

                </View>


                {/* Suggestions List */}
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.country_id.toString()}
                    renderItem={renderItem}
                />

                {searched && suggestions.length === 0 && (
                    <Text style={styles.noCountryText}>
                        No countries found. Please try a different search.
                    </Text>
                )}

                {/* Country Details */}
                {selectedCountry && (
                    <View>
                        <Text style={styles.searchTitle}>{selectedCountry.country_name} Emergency Contacts</Text>

                        {selectedCountry.emergencyContact?.length > 0 && (
                            <>
                                <Text style={styles.contactText}>Description: {selectedCountry.emergencyContact[0].description}</Text>
                                <Text style={styles.contactText}>Police: {selectedCountry.emergencyContact[0].police} </Text>
                                <Text style={styles.contactText}>Fire: {selectedCountry.emergencyContact[0].fire}</Text>
                                <Text style={styles.contactText}>Medical: {selectedCountry.emergencyContact[0].medical}</Text>
                                <Text style={styles.safetyGuidelineTitle}>{selectedCountry.country_name} Safety Guidlines</Text>
                                <Text style={styles.safetyGuidelineText}>{selectedCountry.emergencyContact[0].safety_guidelines}</Text>

                            </>

                        )}

                    </View>
                )}


            </View>


        </SafeAreaView>

    )


};


export default EmergencyContactScreen;