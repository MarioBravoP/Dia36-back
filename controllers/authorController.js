const { getAuthors, getAuthor } = require('../models/authorModel');

// Ver todos los autores
exports.getAuthors = async (req, res) => {
    try {
        const authors = await getAuthors();
        res.json({ authors });
    } catch (error) {
        res.status(500).json({ error: "Error al acceder a los autores" })
    }
}

// Ver un autor por ID y sus libros
exports.getAuthor = async (req, res) => {
    try {
        const authors = await getAuthor(req.params.id);
        res.json({ authors });
    } catch (error) {
        res.status(500).json({ error: "Error al acceder al autor" })
    }
}
