const express = require('express');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const YoutubeMp3Downloader = require("youtube-mp3-downloader");

const YD = new YoutubeMp3Downloader({
  "ffmpegPath": "./vendor/ffmpeg/ffmpeg",        // Where is the FFmpeg binary located?
  "outputPath": "./",                     // Where should the downloaded and encoded files be stored?
  "youtubeVideoQuality": "highest",       // What video quality should be used?
  "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
  "progressTimeout": 2000                 // How long should be the interval of the progress reports
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/getVideo-*', (req, res) => {
  ytdl.getInfo(req.url.substring(10), (err, info) => {
	if (err) {
		res.end();
		return ;
	}
    YD.download(req.url.split('=')[1] || req.url.split('/')[4], 'output.mp3');
    YD.on("finished", () => {
      res.download('./output.mp3', `${info.title}.mp3`);
    })
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${process.env.PWD}/index.html`);
})


app.listen(port, () => {
  console.log(`listening on port: ${port}`);
})
