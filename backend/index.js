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

const disasterData = require('./routes/disasterData');
app.use('/api/disasterData', disasterData);


const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);



const PORT = process.env.PORT 

app.listen(PORT, '192.168.50.181', () => {
  console.log(`Server running on port ${PORT}`);
});