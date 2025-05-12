
import { StyleSheet } from 'react-native';

const lightStyles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative',
    },
    
    pressableCircle: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center',
    },

    icon: {
        color: 'black'
    },


});





const darkStyles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative',
    },
      
    pressableCircle: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center',
       
    },

    
    icon: {
        color: '#FFFFFF'
    },


});

export { lightStyles, darkStyles };
