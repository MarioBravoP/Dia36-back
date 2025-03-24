// Get the client
const connection = require('../connection');

// Obtener todos los editores
async function getPublishers() {
    const conn = await connection.getConnection();
    try {
        const [publishers] = await conn.query(`
            SELECT 
                *
            FROM publishers
        `);
        return publishers;
    } finally {
        conn.release();
    }
}

// Obtener un editor por id
async function getPublisher(id) {
    const conn = await connection.getConnection();
    try {
        const [publishers] = await conn.query(`
            SELECT 
                p.id AS publisher_id, 
                p.name AS publisher_name, 
                b.id AS book_id, 
                b.name AS book_name
            FROM publishers p
            LEFT JOIN books b ON p.id = b.publisher_id
            WHERE p.id = ?
        `, [id]);

        if (publishers.length === 0) {
            throw new Error("Editor no encontrado");
        }

        const publisher = {
            id: publishers[0].publisher_id,
            name: publishers[0].publisher_name,
            books: []
        };

        for (const publisherRow of publishers) {
            if (publisherRow.book_id) {
                publisher.books.push({
                    id: publisherRow.book_id,
                    name: publisherRow.book_name
                });
            }
        }

        return publisher;
    } finally {
        conn.release();
    }
}

module.exports = {
    getPublishers,
    getPublisher,
};