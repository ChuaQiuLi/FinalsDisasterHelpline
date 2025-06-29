import { StyleSheet } from 'react-native';

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        width: '100%',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
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
        marginTop: 20,
    },
    logo: {
        width: 220,
        height: 180,
        marginBottom: 10,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        height: 'auto',
        padding: 25,
        paddingBottom: 10,
        borderRadius: 12
    },
    label: {
        marginBottom: 10,
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
    linkContainer: {
        marginTop: 10,
        width: '80%',
        alignItems: 'flex-start',
        marginVertical: 10,
    },
    linkText: {
        fontSize: 12,
        color: 'blue',
    },
    loginText: {
        fontSize: 12,
        color: 'black',
        marginTop: 10,
    },
    registerButton: {
        width: '80%',
        backgroundColor: '#5eafa1',
        padding: 10,
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 10,
    },
    registerButtonDisabled: {
        backgroundColor: '#A9A9A9',
    },
    registerButtonText: {
        color: '#FFFFFF',
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
        backgroundColor: '#000000',
    },
    scrollViewContent: {
        width: '100%',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
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
        marginTop: 20,
    },
    logo: {
        width: 220,
        height: 180,
        marginBottom: 10,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        height: 'auto',
        padding: 25,
        paddingBottom: 20,
        borderRadius: 12
    },
    label: {
        marginBottom: 10,
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
    linkContainer: {
        marginTop: 10,
        width: '80%',
        alignItems: 'flex-start',
        marginVertical: 10,
    },
    linkText: {
        fontSize: 12,
        color: 'lightblue',
    },
    loginText: {
        fontSize: 12,
        color: '#FFFFFF',
        marginTop: 10,
    },
    registerButton: {
        width: '80%',
        backgroundColor: '#5eafa1',
        padding: 10,
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 10,
    },
    registerButtonDisabled: {
        backgroundColor: '#A9A9A9',
    },
    registerButtonText: {
        color: '#FFFFFF',
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
