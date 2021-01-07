import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';


admin.initializeApp();
const cors = require('cors');
const storage = admin.storage();
const bucket = storage.bucket('timble-demo-website.appspot.com');
const sharp = require('sharp');
const app = express();

app.use(cors({ origin: true }));

exports.helloworld = functions.https.onRequest((req: any, res: any) => {
  res.send('Hello world!')
});

/* ADD MANY METHODS INTO CLOUD FUNCTIONS REQUEST */
app.get('/test-get', async (req: any, res: any) => {
  res.send('Demo presentation firebase!')
});

app.post('/test-post', async (req: any, res: any) => {
  res.send('Demo presentation firebase POST!')
});

exports.app = functions.https.onRequest(app);


/* DEMO CLOUD FUCTION FOR RESIZE IMAGES */
exports.resize = functions.https.onRequest(async (req: any, res: any) => {
  const query = req.query;
  if (query.name) {
    const file = bucket.file(query.name);
    const data = await file.download();
    const contents = data[0]; // Buffer
    let resizeBuffer = contents;
    if (query.w && query.h) {
      const width = +query.w || 20;
      const height = +query.h || 20;
      resizeBuffer = await sharp(contents)
        .resize(width, height, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .toBuffer()
    }
    const resizeImage = Buffer.from(resizeBuffer); // File
    res.setHeader('content-type', 'image/jpg');
    res.send(resizeImage);
  } else {
    res.status(404).send('No Image Found');
  }
});
