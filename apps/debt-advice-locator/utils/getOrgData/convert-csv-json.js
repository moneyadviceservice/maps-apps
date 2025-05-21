const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '../../public/json/';

const csvFilePath = path.resolve(__dirname, 'organisations.csv');
const jsonFilePathFaceToFace = path.resolve(
  __dirname,
  `${OUTPUT_DIR}organisations-face-to-face.json`,
);
const jsonFilePathOnlineTel = path.resolve(
  __dirname,
  `${OUTPUT_DIR}organisations-tel-online.json`,
);

const jsonFilePathLngLat = path.resolve(
  __dirname,
  `${OUTPUT_DIR}organisations-lng-lat.json`,
);

const resultsFaceToFace = [];
const resultsTelOnline = [];
const resultsLngLat = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => {
    if (data.provides_face_to_face.toLowerCase() === 'true') {
      resultsFaceToFace.push({
        ...data,
        notes: data.notes.replace("'", '’'),
      });
      resultsLngLat.push({
        id: Number(data.id),
        lng: Number(data.lng),
        lat: Number(data.lat),
      });
    }

    if (
      data.provides_telephone.toLowerCase() === 'true' ||
      data.provides_web.toLowerCase() === 'true'
    ) {
      resultsTelOnline.push({
        ...data,
        notes: data.notes.replace("'", '’'),
      });
    }
  })
  .on('end', () => {
    fs.writeFileSync(jsonFilePathFaceToFace, JSON.stringify(resultsFaceToFace));
    fs.writeFileSync(jsonFilePathOnlineTel, JSON.stringify(resultsTelOnline));
    fs.writeFileSync(jsonFilePathLngLat, JSON.stringify(resultsLngLat));
  });
