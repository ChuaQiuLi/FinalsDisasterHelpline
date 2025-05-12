import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightStyles, darkStyles } from '../styles/homeScreenStyle';
import { useTheme } from '../context/themeContext'; 
import API from '../api';



function HomeScreen() {
  // Stores the user's current location
  const [location, setLocation] = useState(null);
  // Stores any error messages related to location
  const [errorMsg, setErrorMsg] = useState(null);
  // Stores all disaster data fetched from the API
  const [disasterData, setDisasterData] = useState([]);
  // Stores disasters filtered by proximity if enabled
  const [filteredDisasters, setFilteredDisasters] = useState([]);
  // Tracks when the app is loading data
  const [loading, setLoading] = useState(true);
  // Tracks when the list is being refreshed
  const [refreshing, setRefreshing] = useState(false);
  // Tracks which disaster is currently selected
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  // Sets how far (in km) to look for nearby disasters
  const [proximityRadius, setProximityRadius] = useState(2000);
  // Toggles whether to show only nearby disasters 
  const [filterByProximity, setFilterByProximity] = useState(false);
  // Store the user's country
  const [country, setCountry] = useState(null);
  // Track if country data is being fetched
  const [countryLoading, setCountryLoading] = useState(false);
  // Dark or light theme
  const { isDarkMode } = useTheme(); 
  const styles = isDarkMode ? darkStyles : lightStyles; 



    const getLocationAndFetchData = async () => {
    // Sets the loading state to true
    setLoading(true);
    // Requests permission to access the device's location
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    // If permission is denied, shows an error but still fetches global disaster data
    // If permission is granted, gets the current location and updates the map region
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      // Even without permission, we can still fetch global disaster data
      await fetchDisasterData();
      setLoading(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      // Enable proximity filtering by default when location is available
      setFilterByProximity(true); 
      await fetchDisasterData();
    } 
    
    catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Could not get your location. Showing global data instead.');
      await fetchDisasterData();
    }
     
    // Sets loading to false when done
    finally {
      setLoading(false);
    }
  };

  // Function to get country from coordinates using Expo's reverseGeocodeAsync
  const getUserCountry = async () => {
    if (!location) return;
    
    setCountryLoading(true);
    try {
      const { latitude, longitude } = location.coords;
      const geocodeResult = await Location.reverseGeocodeAsync({ latitude, longitude});
      
      if (geocodeResult && geocodeResult.length > 0) {
        // Get the country name from the first result
        setCountry(geocodeResult[0].country);
      } 
      
      else {
        setCountry("Unknown");
      }
    } 
    
    catch (error) {
      console.error('Error getting country:', error);
      setCountry("Could not determine country");
    } 
    
    finally {
      setCountryLoading(false);
    }
  };


  useEffect(() => {
    (async () => {
      await getLocationAndFetchData();
    })();
  }, []);


  // Apply proximity filter whenever location or disaster data changes
  // If location is available and there's disaster data, it applies proximity filtering else shows all disasters without filtering
  useEffect(() => {
    if (location && disasterData.length > 0) {
      applyProximityFilter();
    } 
    
    else {
      setFilteredDisasters(disasterData);
    }

  }, [location, disasterData, proximityRadius, filterByProximity]);


  // Get country information when location changes
  useEffect(() => {
    if (location) {
      getUserCountry();
    }

  }, [location]);

  
  // Calculate distance between two points using Haversine formula
  // Takes two sets of latitude/longitude coordinates
  // Converts angles from degrees to radians
  // Applies the Haversine formula to account for Earth's curvature
  // Returns the distance in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Radius of the Earth in km
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = R * c; 

    return distance;
    
  };

  // Apply proximity filter based on user location
  const applyProximityFilter = () => {
    // If location isn't available or filtering is disabled, shows all disasters else filters disasters to only those within the set radius
    if (!location || !filterByProximity) {
      setFilteredDisasters(disasterData);
      return;
    }

    const filtered = disasterData.filter(disaster => {
      if (!disaster.latitude || !disaster.longitude) return false;
      
      // Calculates and stores the distance to each disaster
      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        disaster.latitude,
        disaster.longitude
      );
      
      // Add distance property for display
      disaster.distance = distance; 
      return distance <= proximityRadius;
    });

    // Sorts disasters by proximity (closest first)
    // Updates the filtered disasters state
    filtered.sort((a, b) => a.distance - b.distance);
    setFilteredDisasters(filtered);

  };

  // simply toggles the filter on/off
  const toggleProximityFilter = () => {
    setFilterByProximity(!filterByProximity);
  };



  const fetchDisasterData = async () => {
    try {
      // Replace with your actual server URL if deployed
      const response = await API.get('/api/disasterData/disasters'); 
      setDisasterData(response.data);
    } 
    
    catch (error) {
      console.error('Error fetching disaster data:', error);
      Alert.alert('Error', 'Failed to fetch disaster data. Please try again later.');
    }
  };


  // Handles pull-to-refresh functionality for the disaster list
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDisasterData();
    setRefreshing(false);
  };

  // Maps severity levels to appropriate colors for map markers
  const getMarkerColor = (severity) => {
    switch (severity) {
      // Red color for severe disasters
      case 'Red': return '#ff4d4f'; 
      // Orange color for high-risk disasters
      case 'Orange': return '#fa8c16'; 
      // Yellow color for moderate disasters
      case 'Yellow': return '#fadb14'; 
      // Green color for low-risk disasters
      case 'Green': return '#52c41a'; 
      // Blue color for unknown severity
      default: return '#1890ff'; 
    }
  };

  // Creates a touchable card that highlights when selected
  // Displays the disaster's: Title, Severity (with color coding), Date, Type (earthquake, flood, etc.), Distance from user (if available), Brief description (limited to 2 lines)
  const renderDisasterItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.disasterItem, 
        selectedDisaster?.id === item.id && styles.selectedItem
      ]}
      onPress={() => {
        setSelectedDisaster(item);
      }}
    >
      <View style={styles.disasterHeader}>
        <Text style={styles.disasterTitle}>{item.title}</Text>
        <View style={[styles.severityBadge, { backgroundColor: getMarkerColor(item.severity) }]}>
          <Text style={styles.severityText}>{item.severity}</Text>
        </View>
      </View>
      <Text style={styles.disasterDate}>{item.formattedDate}</Text>
      <Text style={styles.disasterType}>{item.eventType}</Text>
      {item.distance !== null && (
        <Text style={styles.distanceText}>
          {item.distance.toFixed(0)} km away
        </Text>
      )}
      {/* <Text style={styles.coordinatesText}>
        Coordinates: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
      </Text> */}
      <Text numberOfLines={3} style={styles.disasterDescription}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  // This section displays a loading indicator and message while data is being fetched.
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading disaster data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Disaster Alert</Text>
        {location ? (
          <View>
            <Text style={styles.locationText}>
              Location tracked: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
            </Text>
            <Text style={styles.countryText}>
              {countryLoading ? 'Detecting country...' : country ? `Country: ${country}` : 'Country: Unknown'}
            </Text>
          </View>
        ) : (
          <Text style={styles.locationText}>
            {errorMsg || 'Getting location...'}
          </Text>
        )}
        {location && (
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={toggleProximityFilter}
          >
            <Text style={styles.filterButtonText}>
              {filterByProximity ? 'Showing Nearby' : 'Showing All'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {filterByProximity ? 'Nearby Disasters' : 'All Recent Disasters'}
          </Text>
          <Text style={styles.listCount}>
            {filteredDisasters.length} found
          </Text>
        </View>
        
        {filteredDisasters.length > 0 ? (
          <FlatList
            data={filteredDisasters}
            renderItem={renderDisasterItem}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            initialNumToRender={5}
          />

        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              No disasters found {filterByProximity ? 'within ' + proximityRadius + ' km' : ''}
            </Text>
            {filterByProximity && (
              <TouchableOpacity
                style={styles.adjustRadiusButton}
                onPress={() => setProximityRadius(proximityRadius + 1000)}
              >
                <Text style={styles.adjustRadiusText}>
                  Increase search radius
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
    </SafeAreaView>
  );
}


export default HomeScreen;