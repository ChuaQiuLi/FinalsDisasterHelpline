const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser'); 
const moment = require('moment');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();


router.get('/disasters', async (req, res) => {
    try {
        const GDACS_URL = process.env.GDACS_URL 
        // Makes an HTTP request to the GDACS (Global Disaster Alert and Coordination System) RSS feed
        // GDACS API feed for RSS format (XML)
        const response = await axios.get(GDACS_URL);
        const xmlData = response.data;

        // Parses the XML response
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

        const parsedData = parser.parse(xmlData);
        
        // Extract disaster items from RSS feed
        // Convert to array if only one item
        let rssItems = parsedData.rss.channel.item;
        if (!Array.isArray(rssItems)) {
            rssItems = [rssItems]; 
        }
        
        const disasters = rssItems.map(item => {
            // Extract coordinates from georss:point
            let latitude = 0, longitude = 0;
            if (item['georss:point']) {
                const coords = item['georss:point'].split(' ');
                if (coords.length === 2) {
                    latitude = parseFloat(coords[0]);
                    longitude = parseFloat(coords[1]);
                }
            }

            // Extract event type and severityr
            let eventType = 'Unknown';
            if (item.title.toLowerCase().includes('earthquake')) eventType = 'Earthquake';
            else if (item.title.toLowerCase().includes('tropical cyclone')) eventType = 'Tropical Cyclone';
            else if (item.title.toLowerCase().includes('flood')) eventType = 'Flood';
            else if (item.title.toLowerCase().includes('volcanic')) eventType = 'Volcano';
            else if (item.title.toLowerCase().includes('drought')) eventType = 'Drought';
            else if (item.title.toLowerCase().includes('tsunamis')) eventType = 'Tsunamis';
            else if (item.title.toLowerCase().includes('forest fire')) eventType = 'Forest Fire';

            let severity = 'Unknown';
            // Try to get alert level directly from gdacs:alertlevel element
            if (item['gdacs:alertlevel']) {
                severity = item['gdacs:alertlevel'].charAt(0).toUpperCase() + item['gdacs:alertlevel'].slice(1).toLowerCase();
            }

            // Fallback to alertscore if alert level not available
            else if (item['gdacs:alertscore']) {
                const alertScore = parseFloat(item['gdacs:alertscore']);
                if (alertScore >= 2) severity = 'Red';
                else if (alertScore >= 1) severity = 'Orange';
                else if (alertScore >= 0.5) severity = 'Yellow';
                else severity = 'Green';
            }

            // Cleans up description text by removing HTML tags
            const strippedDescription = item.description.replace(/<\/?[^>]+(>|$)/g, '');

            // Creates a structured object with all relevant information
            // Will be calculated if location is available
            return {
                id: item.link,
                title: item.title,
                description: strippedDescription,
                pubDate: item.pubDate,
                formattedDate: moment(item.pubDate).format('DD/MM/YYYY'),
                link: item.link,
                latitude,
                longitude,
                eventType,
                severity,
                distance: null 
            };

        });

        // Sorts disasters by date (newest first)
        disasters.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            
        // Send data to frontend
        res.json(disasters);

    }
    
    catch (error) {
        console.error('Error fetching disaster data:', error);
        res.status(500).json({ message: 'Error fetching disasters' });

    }

});



module.exports = router;
