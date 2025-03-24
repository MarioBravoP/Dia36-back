// Get the client
const connection = require('../connection');

// Obtener todos los autores
async function getAuthors() {
    const conn = await connection.getConnection();
    try {
        const [authors] = await conn.query(`
            SELECT 
                *
            FROM authors
        `);
        return authors;
    } finally {
        conn.release();
    }
}

// Obtener un autor por id y sus libros
async function getAuthor(id) {
    const conn = await connection.getConnection();
    try {
        const [authors] = await conn.query(`
            SELECT 
                a.id AS author_id, 
                a.name AS author_name, 
                b.id AS book_id, 
                b.name AS book_name
            FROM authors a
            LEFT JOIN authors_books ab ON a.id = ab.author_id
            LEFT JOIN books b ON ab.book_id = b.id
            WHERE a.id = ?
        `, [id]);

        if (authors.length === 0) {
            throw new Error("Autor no encontrado");
        }

        const author = {
            id: authors[0].author_id,
            name: authors[0].author_name,
            author_books: []
        };

        for (const authorRow of authors) {
            if (authorRow.book_id) {
                author.author_books.push({
                    id: authorRow.book_id,
                    name: authorRow.book_name,
                });
            }
        }

        return author;
    } finally {
        conn.release();
    }
}

module.exports = {
    getAuthors,
    getAuthor,
};