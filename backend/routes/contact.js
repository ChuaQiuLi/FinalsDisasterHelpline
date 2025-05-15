const express = require('express');
const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();
const router = express.Router();


router.get('/user/country', async (req, res) => {

  const { user_id } = req.query;

  try {

    const user = await prisma.user.findUnique({
      where: {
        user_id: parseInt(user_id),
      },

      select: {
        country: true,
      },

    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Have a default country when user country cannot be found
    const countryName = user.country || "Singapore "; 

    const emergencyContact = await prisma.country.findUnique({
      where: {
        country_name: countryName,
      },

      select: {
        country_name: true, 
        emergencyContact: {
          select: {
            police: true,
            fire: true,
            medical: true,
            description: true,

          },

        },

      },

    });

    res.json(emergencyContact);

  }

  catch (error) {
    console.error('Error fetching emergency contact:', error);
    res.status(500).json({ error: 'Failed to fetch emergency contact' });

  }

});


// The link will look like this: api/contact/user/countries?search=
router.get('/countries', async (req, res) => {

  const { search } = req.query;

  try {

    const countries = await prisma.country.findMany({
      where: {
        country_name: {
          contains: search,
          mode: 'insensitive'
        }
      },

      select: {
        country_id: true,
        country_name: true
      },

   
    });

    res.json(countries);

  }


  catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch search suggestions' });

  }

});



router.get('/countries/:country_id/contacts', async (req, res) => {

 const { country_id } = req.params;

  try {

    const country = await prisma.country.findUnique({
      where: {
        country_id: parseInt(country_id)
        
      },

      select: {
        country_name: true, 
        emergencyContact: {
          select: {
            police: true,
            fire: true,
            medical: true,
            description: true,

          },

        },

      },

   
    });


    res.json(country);

  }


  catch (error) {
    console.error('Error fetching country emergency contact:', error);
    res.status(500).json({ error: 'Failed to fetch country emergency contact' });

  }

});


module.exports = router;