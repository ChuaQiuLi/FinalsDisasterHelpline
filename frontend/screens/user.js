const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const prisma = new PrismaClient();
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'final.disaster.helplinee@outlook.com',
    pass: 'AgileSafeSpace91',
  },
});

const sendResetCode = async (email, resetCode) => {
  try {
    let info = await transporter.sendMail({
      from: '"Safespace" <final.disaster.helplinee@outlook.com>',
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is ${resetCode}.`,
      html: `<p>Your password reset code is <b>${resetCode}</b></p>`,
    });
  } catch (error) {
    console.error('Error sending reset code:', error);
  }
};

const resetRequests = {};

router.get('/details', async (req, res) => {
  try {

    const { user_id } = req.query;

    const profilePicture = await prisma.User.findUnique({
      where: {
        user_id: parseInt(user_id),
      },

      select: {
        username: true,
        email: true,
        profileImage: true
      }

    });

    res.json(profilePicture);

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

  const { user_id, username, email, profileImage } = req.body;

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
      data: { username: username, email: email, profileImage: profileImage || null }
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
    // Upsert to create or update the theme settings
    const updatedSettings = await prisma.Setting.upsert({
      where: { user_id: parseInt(user_id) },
      update: { theme },
      create: { user_id: parseInt(user_id), theme }

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
    const settings = await prisma.Setting.findUnique({
      where: { user_id: parseInt(userId) }

    });

    // Return the settings or default to 'system' theme if not found
    const response = settings || { theme: 'system' };

    res.json(response);

  }

  catch (error) {
    console.error('Failed to retrieve theme:', error);
    res.status(500).json({ error: 'Failed to retrieve theme' });
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
      await prisma.reportCard.deleteMany({ 
        where: { OR: [{ user_id: parsedUserId }, { reported_user_id: parsedUserId }] } 
      });

      await prisma.reportReply.deleteMany({ 
        where: { OR: [{ user_id: parsedUserId }, { reported_user_id: parsedUserId }] } 
      });

      await prisma.ReportComment.deleteMany({ where: { user_id: parsedUserId } });
      await prisma.ReportPost.deleteMany({ where: { user_id: parsedUserId } });
      

      // Delete records referencing CaringCards and ReceivedCaringCards
      await prisma.replyCaringCards.deleteMany({
        where: { OR: [{ sender_id: parsedUserId }, { receiver_id: parsedUserId }] }
      });
      await prisma.receivedCaringCards.deleteMany({
        where: { OR: [{ sender_id: parsedUserId }, { receiver_id: parsedUserId }] }
      });

      await prisma.caringCards.deleteMany({ where: { user_id: parsedUserId } });

      // Delete from other tables
      await prisma.like.deleteMany({ where: { user_id: parsedUserId } });
      await prisma.comment.deleteMany({ where: { user_id: parsedUserId } });
      await prisma.post.deleteMany({ where: { author_id: parsedUserId } });
      await prisma.moodTracker.deleteMany({ where: { user_id: parsedUserId } });
      await prisma.setting.deleteMany({ where: { user_id: parsedUserId } });
      await prisma.privateCards.deleteMany({ where: { user_id: parsedUserId } });
      await prisma.subforum.deleteMany({ where: { creator_id: parsedUserId } });

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
  } catch (error) {
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
  } else {
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
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});


module.exports = router;