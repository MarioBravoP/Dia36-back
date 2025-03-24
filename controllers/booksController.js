const { getBooks, getBook, createBook, updateBook, deleteBook } = require('../models/bookModel');

// Ver todos los libros
exports.getBooks = async (req, res) => {
    try {
        const books = await getBooks();
        res.json({ books });
    } catch (error) {
        res.status(500).json({ error: "Error al acceder a los libros" })
    }
}

// Ver un libro por ID
exports.getBook = async (req, res) => {
    try {
        const books = await getBook(req.params.id);
        res.json({ books });
    } catch (error) {
        res.status(500).json({ error: "Error al acceder al libro" })
    }
}

// Crear libros
exports.createBook = async (req, res) => {
    const { name, genre, price, published, publisher_id, authors_id } = req.body;

    try {
        await createBook(name, genre, price, published, publisher_id, authors_id);
        res.json({ message: "Libro creado correctamente" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: "Este libro ya está registrado." });
        } else {
            console.error("Error al crear inventario:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }
}

// Actualizar libro
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { name, genre, price, published, publisher_id, authors_id } = req.body;

    try {
        await updateBook(id, name, genre, price, published, publisher_id, authors_id);
        res.json({ message: "Libro actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar libro" });
    }
};

// Eliminar libro
exports.deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteBook(id);
        res.json({ message: "Libro eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar libro" });
    }
};