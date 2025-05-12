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
        backgroundColor: '#5eafa1',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    acctDeleteButton: {
        width: '100%',
        backgroundColor: '#e41f1f',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 10,
    },
    acctDeleteButtonText: {
        color: '#fff',
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
        backgroundColor: '#5eafa1',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 10,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    acctDeleteButton: {
        width: '100%',
        backgroundColor: '#e41f1f',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 10,
    },
    acctDeleteButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },

});



export { lightStyles, darkStyles};