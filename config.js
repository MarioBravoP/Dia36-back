if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({
        path: `.env.${process.env.NODE_ENV || 'development'}`
    });
}

module.exports = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
    },
};