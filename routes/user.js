const express = require("express");
var router = express.Router();
const userModel = require("../models/userModel");
const csv = require('csv-parser')
const fs = require('fs')
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get("/", async (req, res) => {
  return res.send('API');
});

// API endpoint to handle CSV file upload
router.post('/upload', upload.single('csvFile'), async (req, res) => {
  try {
    // Read the uploaded CSV file
    const file = req.file;
    const filePath = file.path;

    // const filePath = './sample.csv';

    console.log("filepath"+filePath)

    // Parse the CSV file
    const   results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Store the data in MongoDB
        await userModel.insertMany(results);
        // Return a JSON response
        res.json({ message: 'Data stored successfully',
      data:results });
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


module.exports = router;