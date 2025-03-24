const { getStores, getStore } = require('../models/storeModel');

// Ver todas las tiendas
exports.getStores = async (req, res) => {
    try {
        const stores = await getStores();
        res.json({ stores });
    } catch (error) {
        res.status(500).json({ error: "Error al acceder a las tiendas" })
    }
}

// Ver una tienda por ID y sus libros
exports.getStore = async (req, res) => {
    try {
        const stores = await getStore(req.params.id);
        res.json({ stores });
    } catch (error) {
        res.status(500).json({ error: "Error al acceder a la tienda" })
    }
}
