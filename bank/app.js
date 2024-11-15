// app.js

const express = require('express');
const app = express();
const { execSync } = require('child_process');

// Define a port
const PORT = process.env.PORT || 3000;

// Set up a route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});


function compileAndSetupCircuits() {
  // Remove the existing circuits  
  runCommand('./script-remove.sh');
  // Compile the circuits
  runCommand('./script-compile-circom.sh');

}

function runCommand(command) {
    try {
        console.log(`Executing: ${command}`);
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
    }
}

// Start the server
app.listen(PORT, () => {
  compileAndSetupCircuits()
  console.log(`Server is running on http://localhost:${PORT}`);
});

