// Import the express module
import express from 'express';

// Import the mysql module
import mysql2 from 'mysql2';

// Import the dotenv module
import dotenv from 'dotenv';

// Load environment variables from .env file
// This MUST be called before accessing process.env
dotenv.config();

// Create a CONNECTION POOL to the database
// Uses environment variables from the .env file
const pool = mysql2.createPool({
    host: process.env.DB_HOST,          // Your Digital Ocean IP
    user: process.env.DB_USER,          // MySQL username
    password: process.env.DB_PASSWORD,  // MySQL password from readme.md
    database: process.env.DB_NAME,      // Database name
    port: process.env.DB_PORT           // MySQL port
}).promise();

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

// Define a route to test database connection
app.get('/db-test', async(req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.send(orders);
    } catch(err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

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
// Displays all orders from the database
app.get('/admin', async(req, res) => {
    // res.send(orders);
    // res.sendFile(`${import.meta.dirname}/views/admin.html`);
    //res.render('admin', { orders });

    try {
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');

        // Optional
        orders.forEach(order => {
            Date(order.timestamps).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        });

        res.render('admin', {orders: orders});
    } catch(err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

// Define a "submit-route" route
app.post('/submit-order', async(req, res) => {
    /*
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
    */

    try {
        // Get the order data from the form submission
        const order = req.body;

        // Convert the toppings array into a comma-separated string
        order.toppings = Array.isArray(order.toppings) ?
        order.toppings.join(", ") : "";

        // Add a timestamp to track when this order was placed
        order.timestamp = new Date();

        // Log the order to the server console (helpful for debugging)
        console.log('New order received:', order);

        // Define an SQL INSERT query
        // The ? are PLACEHOLDERS that will be replaced with actual values
        const sql = `INSERT INTO orders (fname, lname, email, size, method, toppings, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        // Create an array of parameters for each ? placeholder in order
        const params = [
            order.fname,
            order.lname,
            order.email,
            order.size,
            order.method,
            order.toppings,
            order.timestamp
        ];

        // Execute the query with the parameters
        const [result] = await pool.execute(sql, params);

        // Optional
        console.log('Order inserted with ID:', result.insertId);

        // Pass the order data to the confirmation page
        res.render('confirmation', { order: order });
    } catch(err) {
        console.error('Error inserting order:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).send('An order with this email already exists.');
        } else {
            res.status(500).send('Sorry, there was an error processing your order. Please try again.');
        }
    }
});

// Start the server and listen on the specific port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});