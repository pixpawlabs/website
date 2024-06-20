// TODO take a local file or url such as  https://s.gravatar.com/avatar/f00946fbd1a30d45a1122c2d1b7cb966?s=2048 as input and create a new file with the same content but with a different size:
// - dist/favicon-16x16.png
// - dist/favicon-32x32.png
// - dist/favicon.ico
// - dist/mstile-150x150.png
// - dist/apple-touch-icon.png
// - dist/android-chrome-192x192.png
// - dist/android-chrome-512x512.png

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const fetch = require('node-fetch');

const sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'favicon.ico': 64,
    'mstile-150x150.png': 150,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
    'main-picture.png': 2048
};
    
    // Function to download the image from a given URL
    async function downloadImage(url, destination) {
        const response = await fetch(url);
        const buffer = await response.buffer();
        fs.writeFileSync(destination, buffer);
    }

    // Function to resize the image and save it with a new size
    async function resizeImage(inputPath, outputPath, size) {
        await sharp(inputPath)
            .resize(size, size)
            .toFile(outputPath);
    }

    // Function to process the input and create the new files
    async function processInput(input) {
        // Check if the input is a URL or a local file path
        if (input.startsWith('http')) {
            // Download the image from the URL
            const tempPath = '/tmp/temp-image.png';
            await downloadImage(input, tempPath);
            input = tempPath;
        }

        // Create the new files with different sizes
        for (const [fileName, size] of Object.entries(sizes)) {
            const outputPath = path.join('dist', fileName);
            await resizeImage(input, outputPath, size);
        }
    }

    // Call the processInput function with the input file or URL
    //const input = 'https://s.gravatar.com/avatar/f00946fbd1a30d45a1122c2d1b7cb966?s=2048';
    const input = process.argv[2];
    processInput(input);