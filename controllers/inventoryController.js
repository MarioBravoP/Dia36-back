const { getInventories, getInventory, createInventory, updateInventory, deleteInventory } = require('../models/inventoryModel');

// Ver todos los inventarios
exports.getInventories = async (req, res) => {
    try {
        const inventories = await getInventories();
        res.json({ inventories });
    } catch (error) {
        res.status(500).json({ error: "Error al acceder a los inventarios" })
    }
}

// Ver un inventario por ID de libro
exports.getInventory = async (req, res) => {
    try {
        const inventory = await getInventory(req.params.id);
        res.json({ inventory });
    } catch (error) {
        res.status(500).json({ error: "Error al acceder al inventario" })
    }
}

// Crear inventario
exports.createInventory = async (req, res) => {
    const { book_id, store_id, stock } = req.body;

    try {
        await createInventory(book_id, store_id, stock);
        res.status(201).json({ message: "Inventario creado correctamente" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: "Este libro ya está registrado en esta tienda." });
        } else {
            console.error("Error al crear inventario:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }
};

// Actualizar inventario
exports.updateInventory = async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    try {
        await updateInventory(id, stock);
        res.json({ message: "Elemento actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar inventario" })
    }
}

// Borrar inventario
exports.deleteInventory = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteInventory(id);
        res.json({ message: "Elemento eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la entrada" })
    }
}