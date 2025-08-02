import { StyleSheet } from 'react-native';


const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 8,

  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 6,
    fontSize: 18,
  },

  input: {
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, 
    color: '#000000',
  },

  saveButton: {
    backgroundColor: '#5eafa1',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  errorContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 5,
  },

  errorText: {
    color: '#721c24',
    fontSize: 16,
  },

});




const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },


  header: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 8,

  },


  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  inputContainer: {
    marginBottom: 20,
  },


  label: {
    marginBottom: 5,
    fontSize: 18,
    color: '#ffffff',

  },

  input: {
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderRadius: 4, 
    color: '#000000',
  },

  saveButton: {
    backgroundColor: '#5eafa1',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  errorContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 5,
  },

  errorText: {
    color: '#721c24',
    fontSize: 16,
  },

});



export { lightStyles, darkStyles};