const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  // Create the destination directory if it does not exist
  await fs.mkdir(dest, { recursive: true });

  // Read the source directory
  const entries = await fs.readdir(src, { withFileTypes: true });

  // Iterate over each entry
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // If the entry is a directory, recursively copy it
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      // If the entry is a file, copy it
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Usage
copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'))
  .then(() => console.log('Directory copied successfully'))
  .catch(console.error);
