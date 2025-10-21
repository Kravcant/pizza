// Import the ezpress module
import express from 'express';

// Create an instance of an Express application
const app = express();

// Define the port number where out server will listen
const PORT = 3000;

// Enable static file serving
app.use(express.static('public'));

// Allow the app to parse form data
app.use(express.urlencoded({ extended:true }));

// Create an array to store orders
const orders = [];

// Define a default "route" ('/')
app.get('/', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/home.html`);
});

// Define a "contact-us" route
app.get('/contact-us', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/contact.html`);
});

// Define a "confirm" route
app.get('/confirm', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
});

// Define a "admin" route
app.get('/admin', (req, res) => {
    res.send(orders);
    // res.sendFile(`${import.meta.dirname}/views/admin.html`);
});

// Define a "submit-route" route
app.post('/submit-order', (req, res) => {
    // Create a JSON object to store the data
    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size,
    }
    orders.push(order);
    console.log(orders);

    res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
});

// Start the server and listen on the specific port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});