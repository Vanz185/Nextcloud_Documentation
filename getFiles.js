const fs = require('fs');

const getFiles = (folderPath, fileList, extension) => {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {

        const filePath = `${folderPath}/${file}`;
        const fileStats = fs.statSync(filePath);

        if (fileStats.isDirectory()) {
            getFiles(filePath, fileList, extension);
        } else if (file.endsWith(`${extension}`)) {
            fileList.push(filePath);
        }
    });
    return fileList;
};
module.exports = getFiles