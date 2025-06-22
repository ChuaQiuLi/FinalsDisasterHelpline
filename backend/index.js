const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// Root Route 
app.get('/', (req, res) => {
  res.send('API Page');
});



// Routes

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const disaster = require('./routes/disaster');
app.use('/api/disaster', disaster);


const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);


const checklistRoutes = require('./routes/checklist');
app.use('/api/checklist', checklistRoutes);


const quizRoutes = require('./routes/quiz');
app.use('/api/quiz', quizRoutes);


const badgeRoutes = require('./routes/badge');
app.use('/api/badge', badgeRoutes);


// Start cron job to scheduled notifications
require('./cron/fetchNotificationData');

const PORT = process.env.PORT || 3000 

app.listen(PORT, '192.168.50.181', () => {
  console.log(`Server running on port ${PORT}`);
});