import { StyleSheet } from 'react-native';

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    menu: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        padding: 15,
    },

    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',  
        borderRadius: 8,
        width: '100%',
    },

    switchLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        flex: 1,
    },

    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },

    logoutButton: {
        width: '100%',
        backgroundColor: '#FF9800',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 10,
    },

    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
    },

    accountDeleteButton: {
        width: '100%',
        backgroundColor: '#D32F2F',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 10,
    },

    accountDeleteButtonText: {
        color: '#fff',
        fontSize: 16,
    },

    changePasswordButton: {
        width: '100%',
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 20,
    },

    changePasswordButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },

 
});



const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000000',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },

    menu: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        padding: 15,
    },
    
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        borderRadius: 8,
        width: '100%',
    },
    
    switchLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        flex: 1,
        color: '#ffffff',
    },

    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },

    logoutButton: {
        width: '100%',
        backgroundColor: '#FF9800',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 10,
    },

    logoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },

    accountDeleteButton: {
        width: '100%',
        backgroundColor: '#D32F2F',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 10,
    },

    accountDeleteButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },

    
    changePasswordButton: {
        width: '100%',
        backgroundColor: '#007BFF',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 10,
    },
    
    changePasswordButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },

});



export { lightStyles, darkStyles};
