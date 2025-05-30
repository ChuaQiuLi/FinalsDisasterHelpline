import { StyleSheet } from 'react-native';

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 10,
    fontSize: 18,
    color: 'black',

  },

  input: {
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderRadius: 4,
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

  passwordContainer: {
    position: 'relative',
  },

  icon: {
    position: 'absolute',
    borderRadius: 12,
    right: 15,
    top: 9,
    color: '#000000'
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
    marginBottom: 20,
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
    marginBottom: 10,
    fontSize: 18,
    color: 'black',
    color: '#ffffff',

  },

  input: {
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 4,
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

  passwordContainer: {
    position: 'relative',
  },
  
  icon: {
    position: 'absolute',
    borderRadius: 12,
    right: 15,
    top: 9,
    color: '#000000'
  },

});



export { lightStyles, darkStyles};