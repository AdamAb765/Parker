const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const { uuid } = require("uuidv4");
const path = require('path');

const resourcesFolder = "resources";
const ffmpegPath = path.join(__dirname, `${resourcesFolder}\\ffmpeg.exe`);
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");

const outputFolder = "captures";
const outputImagePrefix = "car-image-";
const outputSuffix = ".jpg";

const API_KEY = "4fe20cf64c591053ded8cd09d83240bf399d7cb6";

app.get("/isAlive", (req, res) => {
  res.status(200).send("Still alive");
});

app.get("/captureParking/:cameraName", async (req, res) => {
  const { cameraName } = req.params;
  const fileName = await captureParking(cameraName);
  const readPhotoResult = await readPhoto(fileName);

  if (readPhotoResult) res.status(200).send(readPhotoResult);
  else res.status(503).send("couldnt parse photo");
});

const captureParking = (cameraName) => {
  var dir = path.join(__dirname, `${outputFolder}/${cameraName}`);

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

  const fileName = path.join(__dirname, `${outputFolder}/${cameraName}/${outputImagePrefix}${uuid()}${outputSuffix}`);

  return new Promise((resolve, reject) => {
    const command = ffmpeg()  
    .input(`video=${cameraName}`)
      .inputFormat("dshow")
      .frames(1)
      .output(fileName)
      .on("end", () => {
        console.log("Picture Taken");
        resolve(fileName);
      })
      .on("error", (err) => {
        return reject(new Error(err));
      });

    command.run();
  });
};


const readPhoto = async (fileName) => {
  let body = new FormData();
  body.append("upload", fs.createReadStream(fileName));
  body.append("regions", "il");
  let result;

  await fetch("https://api.platerecognizer.com/v1/plate-reader/", {
    method: "POST",
    headers: {
      Authorization: `Token ${API_KEY}`,
    },
    body: body,
  })
    .then((res) => res.json())
    .then((json) => {
      result = json;
    })
    .catch((err) => {
      console.log(err);
    });

  return result;
};

const args = process.argv.slice(2);

const port = args[0];
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
