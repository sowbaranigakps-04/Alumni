import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; // Import path module directly
// Remove the line below since 'require' is a built-in function and doesn't need to be imported
// import require from 'require';

dotenv.config();

const app = express();
app.use(cors());

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

  // Create a Mongoose schema for the appointment details
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true // Ensure email is unique
    },
    password: {
      type: String,
      required: true
    }
  });
  
  // Create model for users collection
  const User = mongoose.model('User', userSchema);

app.get('/', async (req, res) => {
  try {
    // Send the HTML file located in the 'public' directory
    res.sendFile(path.join('E:/vaish/js/nod/backend/public/signup.html'));
  } catch (error) {
    console.error('Error sending HTML file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle user signup
app.post('/signup', async (req, res) => {
  try {
    // Extract user details from request body
    const { username, email, password } = req.body;
    console.log(username);
    // Create a new user instance
    const newUser = new User({ username, email, password });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with the saved user object
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if password matches
    if (user.password !== password) {
      // Password incorrect
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Password correct, login successful
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
