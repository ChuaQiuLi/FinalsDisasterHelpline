const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');

const prisma = new PrismaClient();
const router = express.Router();



const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  
});

const sendResetCode = async (email, resetCode) => {
  try {
    let info = await transporter.sendMail({
      from: '"DisasterHelpline" <final.disaster.helpline@outlook.com>',
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is ${resetCode}.`,
      html: `<p>Your password reset code is <b>${resetCode}</b></p>`,
    });
  } 
  
  catch (error) {
    console.error('Error sending reset code:', error);
  }
};

const resetRequests = {};

router.get('/details', async (req, res) => {
  try {

    const { user_id } = req.query;

    const userDetails = await prisma.User.findUnique({
      where: {
        user_id: parseInt(user_id),
      },

      select: {
        username: true,
        email: true,
      }

    });

    res.json(userDetails);

  }

  catch (error) {
    console.error('Error fetching details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }

});


router.post('/change-password', async (req, res) => {

  const { user_id, currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.User.findUnique({
      where: { user_id: user_id },
      select: {
        password: true,
      },

    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare current password with the hashed password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);


    if (!passwordMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await prisma.User.update({
      where: { user_id: user_id },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: 'Password updated successfully' });
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/update-details', async (req, res) => {

  const { user_id, username, email } = req.body;

  try {
    // Check if the username already exists for a different user
    const existingUsername = await prisma.User.findFirst({
      where: {
        username: username,
        NOT: { user_id: user_id }
      }
    });

    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if the email already exists for a different user
    const existingEmail = await prisma.User.findFirst({
      where: {
        email: email,
        NOT: { user_id: user_id }
      }

    });

    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Update the user details
    const updatedUser = await prisma.User.update({
      where: { user_id: user_id },
      data: { username: username, email: email }
    });

    res.json(updatedUser);

  }

  catch (error) {
    console.error('Error updating details:', error);
    res.status(500).json({ error: 'Failed to update details' });
  }

});


router.post('/update-theme', async (req, res) => {

  const { user_id, theme } = req.body;

  try {
    // Update the theme settings
    const updatedSettings = await prisma.User.update({
      where: { user_id: parseInt(user_id) },
      data: { theme },

    });

    res.json(updatedSettings);
  }

  catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({ error: 'Failed to update theme' });
  }

});


router.get('/get-theme/:userId', async (req, res) => {

  const { userId } = req.params;

  try {
    const user = await prisma.User.findUnique({
      where: { user_id: parseInt(userId) }

    });

    // If theme is null, return a default theme
    const response = user ? user : { theme: 'system' };

    res.json(response);

  }

  catch (error) {
    console.error('Failed to retrieve theme:', error);
    res.status(500).json({ error: 'Failed to retrieve theme' });
  }

});



router.post('/updateCountry', async (req, res) => {

  const { country, userId } = req.body;

  if (!country || !userId) {
    return res.status(400).json({ message: 'Country and userId are required' });
  }

  try {
    // Update the user's country in the database
    const user = await prisma.User.update({
      where: { user_id: userId },
      data: { country: country },

    });

    res.status(200).json({ message: 'Country updated successfully', user });

  } 
  
  catch (error) {
    console.error('Error updating country:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});



router.post('/delete-account', async (req, res) => {
  const { user_id } = req.body;

  try {
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const parsedUserId = parseInt(user_id);

    await prisma.$transaction(async (prisma) => {
      // Delete from dependent tables first
      await prisma.UserChecklistStatus.deleteMany({ where: { user_id: parsedUserId } });
      await prisma.checklist.deleteMany({ where: { user_id: parsedUserId } });
      await prisma.QuizResults.deleteMany({ where: { user_id: parsedUserId } });
      await prisma.UserBadge.deleteMany({ where: { user_id: parsedUserId } });
      await prisma.DisasterNotificationLog.deleteMany({ where: { user_id: parsedUserId } });


      // Finally, delete the user
      await prisma.user.delete({
        where: { user_id: parsedUserId }
      });

    });

    res.status(200).json({ message: 'Account deleted successfully' });
    
  } 
  
  catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }

});



// Request password reset
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;
  try {
    // Check if email exists in the database
    const user = await prisma.user.findUnique({
      where: { email },

    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const code = crypto.randomBytes(3).toString('hex');
    const expiresAt = Date.now() + 3600000; // 1 hour expiration
    resetRequests[email] = { code, expiresAt };
    await sendResetCode(email, code);

    res.status(200).json({ message: 'Reset code sent' });
  } 
  
  catch (error) {
    console.error('Error sending reset code:', error);
    res.status(500).json({ error: 'Failed to send reset code' });
  }
   
});



// Verify reset code
router.post('/verify-code', (req, res) => {
  const { email, resetCode } = req.body;

  // Check if the reset code exists for the email
  const storedRequest = resetRequests[email];

  if (!storedRequest) {
    return res.status(400).json({ message: 'Reset request not found' });
  }

  const { code, expiresAt } = storedRequest;

  // Check if the code is expired
  if (Date.now() > expiresAt) {
    delete resetRequests[email]; // Clean up expired requests
    return res.status(400).json({ message: 'Reset code has expired' });
  }

  // Compare codes
  if (code.trim() === resetCode.trim()) {
    return res.status(200).json({ message: 'Code verified successfully' });
  } 
  
  else {
    return res.status(400).json({ message: 'Invalid reset code' });
  }

});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password reset successful' });

  } 
  
  catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
  
});



router.post('/saveExpoToken', async (req, res) => {

  const { user_id, expoPushToken } = req.body;

  console.log(expoPushToken);

  try {
    const updatedUser = await prisma.user.update({
      where: {
        user_id: parseInt(user_id),

      },

      data: {
        expoPushToken: expoPushToken,

      },
        
    });


    console.log('Token saved for user');
    res.status(200).json({ message: 'Saved!' });

  } 
  
  catch (error) {
    console.error('Error saving Expo push token:', error);
    res.status(500).json({ error: 'Failed to save Expo push token' });
    
  }


});



module.exports = router;