/* eslint no-console: 0 */
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '../../../public/json/';

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

const records = [];
let lineNumber = 1;

fs.createReadStream(csvFilePath)
  .pipe(csv({ bom: true }))
  .on('data', (row) => {
    lineNumber++;
    // Handle BOM-prefixed id field if it exists
    const { '\ufeffid': bomId, ...rest } = row;
    const data = { ...rest, id: rest.id || bomId };
    if (!data.id || data.id.trim() === '') {
      data.id = lineNumber.toString();
    }
    records.push(data);
  })
  .on('end', () => {
    const seenIds = new Set();
    const duplicates = [];
    let maxId = 0;

    records.forEach((record, index) => {
      const id = parseInt(record.id, 10);
      if (!isNaN(id) && id > maxId) {
        maxId = id;
      }

      if (seenIds.has(record.id)) {
        duplicates.push({ record, index });
      } else {
        seenIds.add(record.id);
      }
    });

    if (duplicates.length > 0) {
      console.log(
        `Found ${duplicates.length} duplicate IDs. Resolving conflicts...`,
      );
      duplicates.forEach(({ record, index }) => {
        const oldId = record.id;
        maxId++;
        record.id = maxId.toString();
        console.log(
          `  Line ${index + 2}: Changed duplicate ID "${oldId}" to "${
            record.id
          }" for ${record.name}`,
        );
      });
    }

    console.log(`Processing ${records.length} records with unique IDs.`);
    records.forEach((data) => {
      if (data.provides_face_to_face.toLowerCase() === 'true') {
        resultsFaceToFace.push({
          ...data,
          notes: data.notes.replace("'", '\u2019'),
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
          notes: data.notes.replace("'", '\u2019'),
        });
      }
    });

    fs.writeFileSync(jsonFilePathFaceToFace, JSON.stringify(resultsFaceToFace));
    fs.writeFileSync(jsonFilePathOnlineTel, JSON.stringify(resultsTelOnline));
    fs.writeFileSync(jsonFilePathLngLat, JSON.stringify(resultsLngLat));
  });
