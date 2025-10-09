// Import the ezpress module
import express from 'express';

// Create an instance of an Express application
const app = express();

// Define the port number where out server will listen
const PORT = 3000;

// Enable static file serving
app.use(express.static('public'));

// Define a default "route" ('/')
app.get('/', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/home.html`);
});

// Start the server and listen on the specific port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});