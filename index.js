const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Add Environmental Variable
require('dotenv').config();

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//For Form data
const multer = require('multer');
const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });


// Define the User model
const User = mongoose.model('User', {
  username: String,
  password: String,
  email: String
});

// Define the Product model
const Product = mongoose.model('Product', {
  name: String,
  description: String,
  price: Number,
  imageURL: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send('No token provided');
  }
  jwt.verify(token, 'mysecretkey', (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    req.user = decoded;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
    res.json({
      message: 'Welcome, learnly app interview server is active and running updated',
    });
});

//Register
  app.post('/register', upload.none(), async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    try {
      await user.save();
      res.send('User created successfully');
    } catch (err) {
      res.status(400).send(err);
    }
  });
  
//Login
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).send('Invalid email or password');
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).send('Invalid email or password');
      }
      const token = jwt.sign(user.toJSON(), 'mysecretkey', { expiresIn: '1h' });
      res.send({ token });
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
  
//Create products
app.post('/products', authenticate, async (req, res) => {
    const { name, description, price, imageURL } = req.body;
    const product = new Product({ name, description, price, imageURL, createdBy: req.user._id });
    try {
      const savedProduct = await product.save();
      res.send(savedProduct);
    } catch (err) {
      res.status(400).send(err);
    }
  });
  


//Get all products
app.get('/products', authenticate, async (req, res) => {
    try {
      const products = await Product.find().populate('createdBy').exec();
      res.send(products);
    } catch (err) {
      res.status(400).send(err);
    }
  });
  
//Get all products By ID
app.get('/products/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    try {
      const product = await Product.findById(id).populate('createdBy');
      res.send(product);
    } catch (err) {
      res.status(400).send(err);
    }
  });

//Edit entire information about a product By ID
app.put('/products/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  const { name, description, price, imageURL } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(id, { $set: { name, description, price, imageURL } }, { new: true });
    res.send(product);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Delete entire information about a products By ID
app.delete('/products/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    await Product.findByIdAndDelete(id);
    res.send('Product deleted successfully');
  } catch (err) {
    res.status(400).send(err);
  }
});


// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
