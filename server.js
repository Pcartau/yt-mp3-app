const express = require('express');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/getVideo-*', (req, res) => {
  ytdl.getInfo(req.url.substring(10), (err, info) => {
    const stream = ytdl(req.url.substring(10), {
      quality: 'highestaudio',
    })
    proc = new ffmpeg({source:stream})
    proc.setFfmpegPath('./vendor/ffmpeg/ffmpeg');
    proc.saveToFile('./output.mp3')
    .on('end', () => {
      res.download('./output.mp3', `./${info.title}.mp3`);
    })
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${process.env.PWD}/index.html`);
})


app.listen(port, () => {
  console.log(`listening on port: ${port}`);
})
