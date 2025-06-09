import { StyleSheet } from 'react-native';

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9990',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  locationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  countryText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },

  filterButton: {
    marginTop: 8,
    backgroundColor: '#e6f7ff',
    padding: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#1890ff',
  },

  filterButtonText: {
    color: '#1890ff',
    fontWeight: '500',
    fontSize: 12,
  },

  selectedDisasterInfo: {
    marginTop: 16,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    width: '90%',
  },

  selectedDisasterTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

  selectedDisasterCoords: {
    fontSize: 12,
    color: '#666',
  },

  listContainer: {
    flex: 1,
    padding: 16,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  listCount: {
    fontSize: 14,
    color: '#666',
  },

  disasterItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },

  selectedItem: {
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#1890ff',
  },

  disasterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  disasterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },

  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },

  severityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  disasterDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  disasterType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },

  distanceText: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '500',
    marginBottom: 4,
  },

  coordinatesText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  disasterDescription: {
    fontSize: 14,
    color: '#666',
  },

  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },

  adjustRadiusButton: {
    padding: 10,
    backgroundColor: '#1890ff',
    borderRadius: 4,
  },

  adjustRadiusText: {
    color: '#fff',
    fontWeight: '500',
  },

  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },

  retryButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },


});


const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF',

  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#000000',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',

  },
  
  locationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    color: '#FFFFFF',

  },

  countryText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 4,
  },

  filterButton: {
    marginTop: 8,
    backgroundColor: '#e6f7ff',
    padding: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#1890ff',
  },

  filterButtonText: {
    color: '#1890ff',
    fontWeight: '500',
    fontSize: 12,
  },

  selectedDisasterInfo: {
    marginTop: 16,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    width: '90%',
  },

  selectedDisasterTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

  selectedDisasterCoords: {
    fontSize: 12,
    color: '#666',
  },

  listContainer: {
    flex: 1,
    padding: 16,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  listCount: {
    fontSize: 14,
    color: '#666',
  },

  disasterItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },

  selectedItem: {
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#1890ff',
  },

  disasterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  disasterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },

  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },

  severityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  disasterDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  disasterType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },

  distanceText: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '500',
    marginBottom: 4,
  },

  coordinatesText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  disasterDescription: {
    fontSize: 14,
    color: '#666',
  },

  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },

  adjustRadiusButton: {
    padding: 10,
    backgroundColor: '#1890ff',
    borderRadius: 4,
  },

  adjustRadiusText: {
    color: '#fff',
    fontWeight: '500',
  },

  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },

  retryButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },


});

export { lightStyles, darkStyles  };
