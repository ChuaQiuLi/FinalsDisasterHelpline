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



module.exports = router;
