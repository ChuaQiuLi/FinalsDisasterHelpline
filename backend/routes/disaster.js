const express = require('express');
const fetchGDACSData = require('../utils/fetchDisaster');


const router = express.Router();


router.get('/disasterData', async (req, res) => {
    try {
        
        const data = await fetchGDACSData();
        res.json(data);

    }
    
    catch (error) {
        console.error('Error fetching disaster data:', error);
        res.status(500).json({ message: 'Error fetching disasters' });

    }

});


router.post('/save-expo-token', async (req, res) => {
    const { user_id, expoPushToken } = req.body;

    if (!user_id || !expoPushToken) {
        return res.status(400).json({ error: 'Invalid user or expoPushToken' });
    }

    try {
        // Update user record with new expoPushToken
        await prisma.user.update({
        where: { user_id: parseInt(user_id) },
        data: { expoPushToken },

        });

        res.status(200).json({ message: 'Expo push token saved successfully' });

    } 
    
    catch (error) {
        console.error('Error saving Expo push token:', error);
        res.status(500).json({ error: 'Failed to save Expo push token' });
    }


});




module.exports = router;
