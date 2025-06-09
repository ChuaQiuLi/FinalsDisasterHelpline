import { StyleSheet } from 'react-native';

const lightStyles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', 
    },
    
    logo: {
        width: 220,
        height: 180,
        marginBottom: 10,
    },

    
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    
    logo: {
        width: 220,
        height: 180,
        marginBottom: 10,
    },

});


export { lightStyles, darkStyles };
