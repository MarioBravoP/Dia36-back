// Get the client
const connection = require('../connection');

// Obtener todos los libros
async function getBooks() {
    const conn = await connection.getConnection();
    try {
        const [books] = await conn.query(`
            SELECT 
                b.id, b.name, b.genre, b.price, b.published, b.publisher_id, 
                p.name AS publisher_name,
                GROUP_CONCAT(a.name SEPARATOR ', ') AS authors,
                GROUP_CONCAT(a.id SEPARATOR ', ') AS authors_id
            FROM books b
            LEFT JOIN publishers p ON b.publisher_id = p.id
            LEFT JOIN authors_books ab ON b.id = ab.book_id
            LEFT JOIN authors a ON ab.author_id = a.id
            GROUP BY b.id
        `);
        
        const processedBooks = books.map(book => ({
            ...book,
            authors: book.authors ? book.authors.split(', ') : [],
            authors_id: book.authors_id ? book.authors_id.split(', ').map(id => Number(id.trim())) : []
        }));

        return processedBooks;
    } finally {
        conn.release();
    }
}

// Obtener un libro por id
async function getBook(id) {
    const conn = await connection.getConnection();
    try {
        const [books] = await conn.query(`
            SELECT 
                b.id, b.name, b.genre, b.price, b.published, b.publisher_id, 
                p.name AS publisher_name,
                GROUP_CONCAT(a.name SEPARATOR ', ') AS authors,
                GROUP_CONCAT(a.id SEPARATOR ', ') AS authors_id
            FROM books b
            LEFT JOIN publishers p ON b.publisher_id = p.id
            LEFT JOIN authors_books ab ON b.id = ab.book_id
            LEFT JOIN authors a ON ab.author_id = a.id
            WHERE b.id = ?
            GROUP BY b.id
        `, [id]);

        if (books.length === 0) {
            throw new Error("Libro no encontrado");
        }

        const book = books[0];
        return {
            ...book,
            authors: book.authors ? book.authors.split(', ') : [],
            authors_id: book.authors_id ? book.authors_id.split(', ').map(Number) : []
        };
    } finally {
        conn.release();
    }
}

// Crear un nuevo libro
async function createBook(name, genre, price, published, publisher_id, authors_id) {
    return new Promise(async (resolve, reject) => {
        const conn = await connection.getConnection(); 
        try {
            await conn.beginTransaction(); 

            const [bookResult] = await conn.query(
                'INSERT INTO books (name, genre, price, published, publisher_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
                [name, genre, price, published, publisher_id]
            );

            const bookId = bookResult.insertId;

            for (const authorId of authors_id) {
                await conn.query(
                    'INSERT INTO authors_books (author_id, book_id) VALUES (?, ?)',
                    [authorId, bookId]
                );
            }

            await conn.commit();
            resolve({ bookId, message: 'Libro creado y asociado con autores' });
        } catch (error) {
            await conn.rollback();
            reject(error);
        } finally {
            conn.release();
        }
    });
}

// Actualizar libro por ID
async function updateBook(id, name, genre, price, published, publisher_id, authors_id) {
    const conn = await connection.getConnection();

    try {
        await conn.beginTransaction();

        const [updateResult] = await conn.query(
            'UPDATE books SET name = ?, genre = ?, price = ?, published = ?, publisher_id = ? WHERE id = ?',
            [name, genre, price, published, publisher_id, id]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error("Libro no encontrado");
        }

        await conn.query('DELETE FROM authors_books WHERE book_id = ?', [id]);

        for (const authorId of authors_id) {
            await conn.query(
                'INSERT INTO authors_books (author_id, book_id) VALUES (?, ?)',
                [authorId, id]
            );
        }

        await conn.commit();
        return { bookId: id, message: 'Libro actualizado correctamente' };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

// Eliminar libro por ID
async function deleteBook(id) {
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.query('DELETE FROM books WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            throw new Error("Libro no encontrado");
        }

        await conn.commit();
        return { message: "Libro eliminado correctamente" };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
};