// Import required modules
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Construct the absolute path to the text file
const filePath = path.join(__dirname, 'input.txt');

// Create a write stream
const writeStream = fs.createWriteStream(filePath, {
  encoding: 'utf8',
  flags: 'a',
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Display a welcome message
console.log(
  'Welcome! Please enter some text. Type "exit" or press "ctrl + c" to quit.',
);

// Handle line input
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    rl.close();
  } else {
    writeStream.write(input + '\n');
    console.log('Text saved! You can continue typing...');
  }
});

// Handle close event
rl.on('close', () => {
  console.log('Thank you for using our application. Goodbye!');
  process.exit(0);
});
