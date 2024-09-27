const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');

const cors = require('cors'); // Import CORS middleware

const app = express();
const port = process.env.PORT || 3000;

// Make sure this line is present to parse JSON payloads
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Append timestamp to filename
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an audio file!'), false);
    }
  }
});

// Initialize Google Cloud clients
const storageClient = new Storage();
const speechClient = new speech.SpeechClient();

// File upload route
app.post('/upload', upload.single('audioFile'), (req, res) => {
  console.log('Received upload request');
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).send('No file uploaded.');
  }
  
  const filePath = req.file.path;
  console.log('File uploaded successfully:', filePath);
  
  // Send a response back to the client
  res.status(200).json({ message: 'File uploaded successfully', path: filePath });
});

// Add a catch-all route to log unhandled requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// This should be the last route
app.use((req, res) => {
  console.log(`No route found for ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

// Simple test route
app.get('/test', (req, res) => {
  res.send('Server is working');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});