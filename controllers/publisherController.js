const { getPublishers, getPublisher } = require('../models/publisherModel');

// Ver todos los editores
exports.getPublishers = async (req, res) => {
    try {
        const publishers = await getPublishers();
        res.json({ publishers });
    } catch (error) {
        res.status(500).json({ error: "Error al acceder a los editores" })
    }
}

// Ver un editor por ID y sus libros
exports.getPublisher = async (req, res) => {
    try {
        const publishers = await getPublisher(req.params.id);
        res.json({ publishers });
    } catch (error) {
        res.status(500).json({ error: "Error al acceder al editor" })
    }
}
