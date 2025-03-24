const config = require('./config');
const express = require("express");

const app = express();
const cors = require('cors');

const books_routes = require('./routes/books');
const publishers_routes = require('./routes/publishers');
const stores_routes = require('./routes/stores');
const authors_routes = require('./routes/authors');
const inventory_routes = require('./routes/inventory');
const user_routes = require('./routes/users');
const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(express.json());


app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use('/books', books_routes);
app.use('/publishers', publishers_routes);
app.use('/stores', stores_routes);
app.use('/authors', authors_routes);
app.use('/inventory', inventory_routes);
app.use('/users', user_routes);

if (process.env.NODE_ENV !== 'production') {
    const PORT = config.port || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;
