// Import the express module
import express from 'express';

// Create an instance of an Express application
const app = express();

// Set EJS as out view engine
app.set('view engine', 'ejs');

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
    // res.sendFile(`${import.meta.dirname}/views/home.html`);
    res.render('home');
});

// Define a "contact-us" route
app.get('/contact-us', (req, res) => {
    // res.sendFile(`${import.meta.dirname}/views/contact.html`);
    res.render('contact');
});

// Define a "confirm" route
app.get('/confirm', (req, res) => {
    // res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
    res.render('confirmation', { order });
});

// Define a "admin" route
app.get('/admin', (req, res) => {
    // res.send(orders);
    // res.sendFile(`${import.meta.dirname}/views/admin.html`);
    res.render('admin', { orders });
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
        timestamp: new Date()
    }
    orders.push(order);
    console.log(orders);

    // res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
    res.render('confirmation', { order });
});

// Start the server and listen on the specific port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});