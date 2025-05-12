import { StyleSheet } from 'react-native';

const lightStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        height: '100%',
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    logo: {
        width: 250,
        height: 250,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        padding: 25,
        paddingBottom: 10,
        borderRadius: 12
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#A0AEC0',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
    button: {
        backgroundColor: '#5eafa1',
        padding: 10,
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 20,
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    boldText: {
        fontWeight: 'bold',
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
        paddingHorizontal: 20,
        height: '100%',
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20
        
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    logo: {
        width: 250,
        height: 250,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        padding: 25,
        paddingBottom: 10,
        borderRadius: 12
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#A0AEC0',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
    button: {
        backgroundColor: '#5eafa1',
        padding: 10,
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    boldText: {
        fontWeight: 'bold',
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