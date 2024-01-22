const fs = require('fs').promises;
const path = require('path');

async function mergeStyles(src, dest) {
  // Create the destination directory if it does not exist
  await fs.mkdir(path.dirname(dest), { recursive: true });

  // Read the source directory
  const entries = await fs.readdir(src, { withFileTypes: true });

  // Initialize an array to hold the styles
  let styles = [];

  // Iterate over each entry
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);

    // If the entry is a file with a .css extension, read it
    if (entry.isFile() && path.extname(entry.name) === '.css') {
      const style = await fs.readFile(srcPath, 'utf-8');
      styles.push(style);
    }
  }

  // Write the styles to the destination file
  await fs.writeFile(dest, styles.join('\n'), 'utf-8');
}

// Usage
mergeStyles(
  path.join(__dirname, 'styles'),
  path.join(__dirname, 'project-dist', 'bundle.css'),
)
  .then(() => console.log('Styles merged successfully'))
  .catch(console.error);
