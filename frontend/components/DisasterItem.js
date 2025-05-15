import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

const getMarkerColor = (severity) => {
  switch (severity) {
    case 'Red': return '#ff4d4f';
    case 'Orange': return '#fa8c16';
    case 'Yellow': return '#fadb14';
    case 'Green': return '#52c41a';
    default: return '#1890ff';
  }
};

const DisasterItem = ({ item, selectedDisaster, setSelectedDisaster, styles }) => (
    <TouchableOpacity style={[ styles.disasterItem, selectedDisaster?.id === item.id && styles.selectedItem]} onPress={() => setSelectedDisaster(item)}>
    <View style={styles.disasterHeader}>
      <Text style={styles.disasterTitle}>{item.title}</Text>
      
      <View style={[styles.severityBadge, { backgroundColor: getMarkerColor(item.severity) }]}>
        <Text style={styles.severityText}>{item.severity}</Text>
      </View>

    </View>

    <Text style={styles.disasterDate}>{item.formattedDate}</Text>
    <Text style={styles.disasterType}>{item.eventType}</Text>
    
    {item.distance !== null && (
      <Text style={styles.distanceText}>{item.distance.toFixed(0)} km away</Text>
    )}

    <Text numberOfLines={3} style={styles.disasterDescription}>
      {item.description}
    </Text>

  </TouchableOpacity>
);

export default DisasterItem;
