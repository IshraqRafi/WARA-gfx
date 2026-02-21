const ytdl = require('@distube/ytdl-core');
const fs = require('fs');

const url = 'https://www.youtube.com/shorts/FTNrCQPxDHs';
const output = 'public/faaaa.webm';

console.log(`Downloading audio from ${url}...`);

ytdl(url, { filter: 'audioonly' })
    .pipe(fs.createWriteStream(output))
    .on('finish', () => {
        console.log(`Successfully downloaded to ${output}`);
    })
    .on('error', (err) => {
        console.error('Error downloading:', err);
    });
