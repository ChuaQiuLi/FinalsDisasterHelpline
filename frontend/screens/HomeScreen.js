import React from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { lightStyles, darkStyles } from '../styles/HomeScreenStyle';
import useLocationAndDisasters from '../hooks/UseLocationAndDisasters';
import DisasterItem from '../components/DisasterItem';



const HomeScreen = () => {
  const { isDarkMode } = useTheme(); 
  const styles = isDarkMode ? darkStyles : lightStyles; 
  const userId = useSelector(state => state.auth.user.id);
  const { loading, location, country, countryLoading, errorMsg, filteredDisasters, filterByProximity, refreshing, selectedDisaster, onRefresh, toggleProximityFilter, setSelectedDisaster, setProximityRadius, proximityRadius, disasterFetchError } = useLocationAndDisasters(userId);



  const renderDisasterItem = ({ item }) => (
    <DisasterItem
      item={item}
      selectedDisaster={selectedDisaster}
      setSelectedDisaster={setSelectedDisaster}
      styles={styles}
    />
    
  );



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={isDarkMode ? '#ffffff' : '#000000'} />
        <Text style={styles.loadingText}>Loading disaster data...</Text>
      </View>
    );
  }



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Disaster Alert</Text>
        {location ? (
          <>
            <Text style={styles.locationText}>
              Location tracked: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
            </Text>
            <Text style={styles.countryText}>
              {countryLoading ? 'Detecting country...' : country ? `Country: ${country}` : 'Country: Unknown'}
            </Text>
          </>
        ) : (
          <Text style={styles.locationText}>{errorMsg || 'Getting location...'}</Text>
        )}
        {location && (
          <TouchableOpacity style={styles.filterButton} onPress={toggleProximityFilter}>
            <Text style={styles.filterButtonText}>
              {filterByProximity ? 'Showing Nearby' : 'Showing All'}
            </Text>
          </TouchableOpacity>
        )}

      </View>


      {/* Disaster List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {filterByProximity ? 'Nearby Disasters' : 'All Recent Disasters'}
          </Text>

          <Text style={styles.listCount}>
            {filteredDisasters.length} found
          </Text>

        </View>

        {disasterFetchError ? (

          <View style={styles.noDataContainer}>
            <Text style={styles.errorText}>{disasterFetchError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>

          </View>

        ) : filteredDisasters.length > 0 ? (

          <FlatList
            data={filteredDisasters}
            renderItem={renderDisasterItem}
            keyExtractor={item => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />

        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              No disasters found {filterByProximity ? 'within ' + proximityRadius + ' km' : ''}
            </Text>
            
            {filterByProximity && (
              <TouchableOpacity style={styles.adjustRadiusButton} onPress={() => setProximityRadius(proximityRadius + 300)}>
                <Text style={styles.adjustRadiusText}>Increase search radius</Text>
              </TouchableOpacity>
            )}

          </View>
        )}
        
      </View>

    </SafeAreaView>

  );

}

export default HomeScreen;
