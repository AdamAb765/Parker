const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const { uuid } = require("uuidv4");
const path = require("path");

const resourcesFolder = "resources";
const ffmpegPath = path.join(__dirname, `${resourcesFolder}\\ffmpeg.exe`);
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");

var access = fs.createWriteStream("./logger123.log")
process.stdout.write = process.stderr.write = access.write.bind(access)

process.on('uncaughtException', err => {
  console.error((err && err.stack) ? err.stack : err)
})

const outputFolder = "captures";
const outputImagePrefix = "car-image-";
const outputSuffix = ".jpg";

const API_KEY = "4fe20cf64c591053ded8cd09d83240bf399d7cb6";

const args = process.argv.slice(2);
const port = args[0];
const cameraName = args[1];
const parkingId = args[2];

app.get("/isAlive", (req, res) => {
  res.status(200).send("Still alive");
});

app.get("/captureParking/:cameraName", async (req, res) => {
  try {
    const { cameraName } = req.params;
    const fileName = await captureParking(cameraName);
    const readPhotoResult = await readPhoto(fileName);

    if (readPhotoResult) res.status(200).send(readPhotoResult);
    else res.status(503).send("couldnt parse photo");
  } catch (e) {
    console.log(e)
    res.status(503).send("couldnt parse photo");
  }
});

const captureParkingInterval = (cameraName) => {
  setInterval(async () => {
    const fileName = await captureParking(cameraName);
    const readPhotoResult = await readPhoto(fileName);
    try {
      if (readPhotoResult) {
        console.log(
          "Photo captured and parsed successfully :" +
          JSON.stringify(readPhotoResult)
        );

        const data = {
          licensePlate: readPhotoResult.results[0]?.plate,
          pictureDateTime: readPhotoResult.timestamp,
        };

        await fetch(`http://193.106.55.134:3000/parks/${parkingId}`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((json) => {
            result = json;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("Failed to parse photo");
      }
    } catch (ex) {
      console.log(ex);
    }
  }, 0.5 * 60 * 1000);
};

const captureParking = (cameraName) => {
  try {
    var dir = path.join(__dirname, `${outputFolder}/${cameraName}`);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const fileName = path.join(
      __dirname,
      `${outputFolder}/${cameraName}/${outputImagePrefix}${uuid()}${outputSuffix}`
    );

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
  }
  catch (e) {
    console.log(e)
  }
};

const readPhoto = async (fileName) => {
  try {
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
  }
  catch (e) {
    console.log(e)
  }
};

captureParkingInterval(cameraName);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
