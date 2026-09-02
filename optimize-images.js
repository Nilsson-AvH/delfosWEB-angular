const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolder = path.join(__dirname, 'public/images');
const outputFolder = path.join(__dirname, 'public/images/optim');

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach((file) => {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const inputFile = path.join(inputFolder, file);
            const outputFile = path.join(inputFolder, `${path.basename(file, ext)}.webp`);

            console.log(`Optimizing: ${file}`);
            sharp(inputFile)
                .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 75 })
                .toFile(outputFile)
                .then(() => {
                    console.log(`Success: ${outputFile}`);
                })
                .catch(err => {
                    console.error(`Error processing ${file}:`, err);
                });
        }
    });
});
