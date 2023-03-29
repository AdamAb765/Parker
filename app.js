const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const { uuid } = require("uuidv4");

// Set the path to the installation of the ffmpeg
ffmpeg.setFfmpegPath(
  ".\\captures\\ffmpeg.exe"
);

const app = express();
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");

const videoDevice = "Full HD webcam";

const outputFolder = "captures";
const outputImagePrefix = "car-image-";
const outputSuffix = ".jpg";

const API_KEY = "4fe20cf64c591053ded8cd09d83240bf399d7cb6";

app.get("/captureParking", async (req, res) => {
  const fileName = await captureParking();
  const readPhotoResult = await readPhoto(fileName);

  if (readPhotoResult) res.status(200).send(readPhotoResult);
  else res.status(503).send("couldnt parse photo");
});

const captureParking = () => {
  const fileName = `./${outputFolder}/${outputImagePrefix}${uuid()}${outputSuffix}`;

  return new Promise((resolve, reject) => {
    const command = ffmpeg()
      .input(`video=${videoDevice}`)
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

app.listen(5555, () => {
  console.log("listening on port 5555");
});
