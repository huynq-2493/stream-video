const express = require("express");
const app = express();
const axios = require('axios')
const ytdl = require('ytdl-core');

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", async function (req, res) {
  try {
    const videoPath = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    const range = req.headers.range || 'bytes=0-';
    const response = await axios.get(videoPath, {
      responseType: 'stream',
      headers: { range }
    });
    res.writeHead(206, response.headers);
    response.data.pipe(res);
  } catch (error) {
    console.log(error);
  }
});

app.get("/test", async function (req, res) {
  try {
    const videoId = req.query.v;
    const info = (await ytdl.getInfo(videoId));
    const videoPath = ytdl.filterFormats(info.formats, 'videoandaudio')[0].url;

    const range = req.headers.range || 'bytes=0-';
    const response = await axios.get(videoPath, {
      responseType: 'stream',
      headers: { range }
    });
    res.writeHead(206, response.headers);
    response.data.pipe(res);
  } catch (error) {
    console.log(error);
    res.sendFile(__dirname + "/index.html");
  }

});


app.listen(process.env.PORT || 8000, function () {
  console.log("Listening on port ", process.env.PORT || 8000);
});
