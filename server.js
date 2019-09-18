const express = require('express');
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
const YD = new YoutubeMp3Downloader({
    "ffmpegPath": "./vendor/ffmpeg",        // Where is the FFmpeg binary located?
    "outputPath": "./output",               // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 5,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});
 
YD.on("error", function(error) {
    console.log(error);
});

app.get('/getVideo-*', (req, res) => {
  console.log(req.url.split('-')[1]);
  YD.download(req.url.split('-')[1]);
  YD.on("progress", function(progress) {
    console.log(JSON.stringify(progress));
  });
  YD.on("finished", function(err, data) {
    console.log(JSON.stringify(data));
    res.download(`./${data.file}`);
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${process.env.PWD}/index.html`);
})

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
})
