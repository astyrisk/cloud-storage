const express = require('express');
const multer  = require('multer');
const firebase = require('firebase-admin');
const cors = require('cors');
const serviceAccount = require('./file-4cacd-firebase-adminsdk-7d5di-0f4e2238db.json');
const { exec, spawn } = require('child_process');

const request = require('request');

const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: 'file-4cacd.appspot.com'
});

const firebaseUpload = multer();
const localUpload = multer({ dest: 'uploads/' });


app.post('/upload/firebase', firebaseUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const file = req.file;
    const storage = firebase.storage();
    const bucket = storage.bucket();
    const destinationPath = 'uploads/' + Date.now() + '_' + file.originalname;
    const uploadStream = bucket.file(destinationPath).createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });
    uploadStream.on('error', (err) => {
      console.error('Upload stream error:', err);
      res.status(500).json({ error: 'Internal server error.' });
    });
    uploadStream.on('finish', async () => {
      const fileRef = bucket.file(destinationPath);
      try {
        // Make the file public
        await fileRef.makePublic();
        // Construct the public URL
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destinationPath)}?alt=media`;
        console.log(publicUrl);
        res.json({ url: publicUrl });
      } catch (err) {
        console.error('Error making file public:', err);
        res.status(500).json({ error: 'Internal server error.' });
      }
    });
    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// app.post('/upload/firebase', firebaseUpload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded.' });
//     }
//     const file = req.file;
//     const storage = firebase.storage();
//     const bucket = storage.bucket();
//     const destinationPath = 'uploads/' + Date.now() + '_' + file.originalname;
//     const uploadStream = bucket.file(destinationPath).createWriteStream({
//       metadata: {
//         contentType: file.mimetype
//       }
//     });
//     uploadStream.on('error', (err) => {
//       console.error('Upload stream error:', err);
//       res.status(500).json({ error: 'Internal server error.' });
//     });
//     uploadStream.on('finish', async () => {
//       const fileRef = bucket.file(destinationPath);
//       try {
//         const url = await fileRef.getSignedUrl({
//           action: 'read',
//           expires: '03-01-2500'
//         });
//         res.json({ url });
//       } catch (err) {
//         console.error('Error generating signed URL:', err);
//         res.status(500).json({ error: 'Internal server error.' });
//       }
//     });
//     uploadStream.end(req.file.buffer);
//   } catch (err) {
//     console.error('Error uploading file:', err);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// });


app.post('/upload/local', localUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const file = req.file;

    const exifCommand = `exiftool -json ${file.path}`;
    const hashCommand = `openssl md5 ${file.path}`;

    // Execute the exiftool command
    exec(exifCommand, (exifError, exifStdout, exifStderr) => {
      if (exifError) {
        console.error('Error running exiftool:', exifError);
        return res.status(500).send('Internal server error.');
      }

      if (exifStderr) {
        console.error('exiftool stderr:', exifStderr);
      }

      let metadata;
      try {
        metadata = JSON.parse(exifStdout);
      } catch (parseError) {
        console.error('Error parsing exiftool output:', parseError);
        return res.status(500).send('Internal server error.');
      }

      // Execute the openssl command
      exec(hashCommand, (hashError, hashStdout, hashStderr) => {
        if (hashError) {
          console.error('Error running openssl md5:', hashError);
          return res.status(500).send('Internal server error.');
        }

        if (hashStderr) {
          console.error('openssl md5 stderr:', hashStderr);
        }

        let hashOutput = hashStdout;
        let hashArray = hashOutput.split(" ");
        let hashString = hashArray[hashArray.length - 1].trim();

        // Send unified JSON response
        res.status(200).json({
          metadata,
          fileHash: hashString
        });
      });
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send('Internal server error.');
  }
});

app.post('/screenshot/firebase', localUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded.' });
    }

    const videoFilePath = req.file.path;
    const screenshotFilePath = path.join('uploads', Date.now() + '_screenshot.png');

    // Generate a screenshot using FFmpeg
    exec(`ffmpeg -i ${videoFilePath} -ss 00:00:01.000 -vframes 1 ${screenshotFilePath}`, async (error) => {
      if (error) {
        console.error('Error generating screenshot with FFmpeg:', error);
        return res.status(500).json({ error: 'Error generating screenshot.' });
      }

      // Upload the screenshot to Firebase Storage
      const storage = firebase.storage();
      const bucket = storage.bucket();
      const destinationPath = 'screenshots/' + path.basename(screenshotFilePath);
      const uploadStream = bucket.file(destinationPath).createWriteStream({
        metadata: {
          contentType: 'image/png'
        }
      });

      uploadStream.on('error', (err) => {
        console.error('Upload stream error:', err);
        res.status(500).json({ error: 'Internal server error.' });
      });

      uploadStream.on('finish', async () => {
        const fileRef = bucket.file(destinationPath);
        try {
          const url = await fileRef.getSignedUrl({
            action: 'read',
            expires: '03-01-2500'
          });
          res.json({ url });
        } catch (err) {
          console.error('Error generating signed URL:', err);
          res.status(500).json({ error: 'Internal server error.' });
        }
      });

      fs.createReadStream(screenshotFilePath).pipe(uploadStream);
    });

  } catch (err) {
    console.error('Error processing screenshot request:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    request(url).pipe(res);
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
