import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import API from '../api';
import { calculateDistance } from '../utils/calculateDistance';

const useLocationAndDisasters = (userId) => {
  const [location, setLocation] = useState(null);
  const [country, setCountry] = useState(null);
  const [countryLoading, setCountryLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [disasterData, setDisasterData] = useState([]);
  const [filteredDisasters, setFilteredDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [proximityRadius, setProximityRadius] = useState(2000);
  const [filterByProximity, setFilterByProximity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDisasterData = async () => {
    try {
      const response = await API.get('/api/disaster/disasterData');
      setDisasterData(response.data);
    } 
    
    catch (error) {
      console.error('Error fetching disaster data:', error);
    }
  };

  const saveCountryToDatabase = async (userId, country) => {
    try {
      await API.post('/api/user/updateCountry', { userId, country });
    } 
    
    catch (error) {
      console.error('Error saving country to database:', error);
    }
  };

  const getUserCountry = async () => {
    if (!location) return;

    setCountryLoading(true);

    try {
      const { latitude, longitude } = location.coords;
      const geocodeResult = await Location.reverseGeocodeAsync({ latitude, longitude });
      const userCountry = geocodeResult?.[0]?.country;

      if (userCountry) {
        setCountry(userCountry);
        await saveCountryToDatabase(userId, userCountry);
      } 

      else {
        console.error('Country could not be determined');
        setCountry(null);

      }

    } 
    
    catch (error) {
      console.error('Error getting country:', error);
      setCountry(null);
    } 
    
    finally {
      setCountryLoading(false);
    }

  };


  const applyProximityFilter = () => {
    if (!location || !filterByProximity) {
      setFilteredDisasters(disasterData);
      return;
    }

    const filtered = disasterData.filter(d => {
      if (!d.latitude || !d.longitude) return false;
      d.distance = calculateDistance(location.coords.latitude, location.coords.longitude, d.latitude, d.longitude);
      return d.distance <= proximityRadius;
    });

    filtered.sort((a, b) => a.distance - b.distance);
    setFilteredDisasters(filtered);

  };

  const getLocationAndFetchData = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      await fetchDisasterData();
      setLoading(false);
      return;

    }

    try {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setFilterByProximity(true);
      await fetchDisasterData();
    } 
    
    catch (err) {
      console.error('Error getting location:', err);
      setErrorMsg('Displaying all disaster as location is disabled.');
      await fetchDisasterData();
    } 
    
    finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDisasterData();
    setRefreshing(false);
  };


  const toggleProximityFilter = () => {
    setFilterByProximity(prev => !prev);
  };


  useEffect(() => {
    getLocationAndFetchData();
  }, []);


  useEffect(() => {
    if (location) getUserCountry();
  }, [location]);


  useEffect(() => {
    if (location && disasterData.length > 0) {
      applyProximityFilter();
    } 
    
    else {
      setFilteredDisasters(disasterData);
    }

  }, [location, disasterData, proximityRadius, filterByProximity]);

  return {
    loading,
    location,
    country,
    countryLoading,
    errorMsg,
    filteredDisasters,
    filterByProximity,
    refreshing,
    selectedDisaster,
    onRefresh,
    toggleProximityFilter,
    setSelectedDisaster,
    setProximityRadius,
    proximityRadius
  };

};

export default useLocationAndDisasters;
