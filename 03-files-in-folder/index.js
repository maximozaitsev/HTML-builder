// Import required modules
const fs = require('fs').promises;
const path = require('path');

// Construct the absolute path to the directory
const dirPath = path.join(__dirname, 'secret-folder');

// Read the contents of the directory
fs.readdir(dirPath, { withFileTypes: true })
  .then((dirents) => {
    // Filter out directories
    const files = dirents.filter((dirent) => dirent.isFile());

    // Process each file
    files.forEach((file) => {
      // Construct the absolute path to the file
      const filePath = path.join(dirPath, file.name);

      // Get information about the file
      fs.stat(filePath)
        .then((stats) => {
          // Calculate the file size in kilobytes
          const sizeInKb = stats.size / 1024;

          // Get the file extension
          const ext = path.extname(file.name).slice(1);

          // Get the file name without the extension
          const name = path.basename(file.name, '.' + ext);

          // Output the file information
          console.log(`${name} - ${ext} - ${sizeInKb}kb`);
        })
        .catch((err) => {
          console.error(`An error occurred: ${err.message}`);
        });
    });
  })
  .catch((err) => {
    console.error(`An error occurred: ${err.message}`);
  });
