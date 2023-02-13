require("dotenv").config();
const path = require("node:path");
const fs = require("node:fs");
const cloudinary = require("cloudinary").v2;

const directoryPath = path.join(__dirname, "../public/assets/");

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function (file) {
    uploadFile(file);
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

function uploadFile(file) {
  cloudinary.uploader
    .upload(`./public/assets/${file}`, {
      folder: "jmsantos/assets/",
      public_id: file.split(".")[0],
      use_filename: true,
      unique_filename: true,
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
}
