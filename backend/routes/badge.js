const express = require('express');
const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();
const router = express.Router();




router.get('/user-badge', async (req, res) => {
  
    const { user_id } = req.query;

  try {
    const badges = await prisma.badge.findMany({
      select: {
        badge_id: true,
        badge_name: true,
        description: true,
        badge_image_filled: true,
        badge_image_outline: true,
        criteria: true,
        earned_from: true,

        userBadge: {
          where: {
            user_id: parseInt(user_id),
          },

          select: {
            user_badge_id: true,
            earned_at: true,
          },

        },

      },

    });

    res.json(badges);

  } 
  
  
  catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Failed to fetch badge data' });
  }


});





module.exports = router;