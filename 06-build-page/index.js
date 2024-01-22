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

async function buildPage(
  templatePath,
  componentsPath,
  stylesPath,
  assetsPath,
  distPath,
) {
  // Create the destination directory if it does not exist
  await fs.mkdir(distPath, { recursive: true });

  // Read the template file
  let template = await fs.readFile(templatePath, 'utf-8');

  // Find all tag names in the template file
  const tags = template
    .match(/{{\s*\w+\s*}}/g)
    .map((tag) => tag.match(/\w+/)[0]);

  // Replace template tags with the content of component files
  for (let tag of tags) {
    const componentPath = path.join(componentsPath, `${tag}.html`);
    const component = await fs.readFile(componentPath, 'utf-8');
    const regex = new RegExp(`{{\\s*${tag}\\s*}}`, 'g');
    template = template.replace(regex, component);
  }

  // Write the modified template to the index.html file in the project-dist folder
  await fs.writeFile(path.join(distPath, 'index.html'), template, 'utf-8');

  // Compile styles from the styles folder into a single file
  const styles = [];
  const styleFiles = await fs.readdir(stylesPath);
  for (let file of styleFiles) {
    if (path.extname(file) === '.css') {
      const style = await fs.readFile(path.join(stylesPath, file), 'utf-8');
      styles.push(style);
    }
  }
  await fs.writeFile(
    path.join(distPath, 'style.css'),
    styles.join('\n'),
    'utf-8',
  );

  // Copy the assets folder into the project-dist folder
  await copyDir(assetsPath, path.join(distPath, 'assets'));
}

// Usage
buildPage(
  path.join(__dirname, 'template.html'),
  path.join(__dirname, 'components'),
  path.join(__dirname, 'styles'),
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'project-dist'),
)
  .then(() => console.log('Page built successfully'))
  .catch(console.error);
