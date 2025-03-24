// Get the client
const connection = require('../connection');

// Obtener todos los inventarios
async function getInventories() {
    const conn = await connection.getConnection();
    try {
        const [inventories] = await conn.query(`
            SELECT 
                i.id, i.book_id, i.store_id, i.stock, b.name AS book_name, s.name AS store_name
            FROM inventory i
            LEFT JOIN books b ON i.book_id = b.id
            LEFT JOIN stores s ON i.store_id = s.id
            GROUP BY i.id
        `);
        return inventories;
    } finally {
        conn.release();
    }
}

// Obtener un inventario por id de libro
async function getInventory(id) {
    const conn = await connection.getConnection();
    try {
        const [inventory] = await conn.query(`
            SELECT 
                i.id, i.book_id, i.store_id, i.stock, b.name AS book_name, s.name AS store_name
            FROM inventory i
            LEFT JOIN books b ON i.book_id = b.id
            LEFT JOIN stores s ON i.store_id = s.id
            WHERE i.book_id = ? 
        `, [id]);

        if (inventory.length === 0) {
            throw new Error("Libro no encontrado");
        }

        return inventory;
    } finally {
        conn.release();
    }
}

// Crear una nueva entrada de inventario
async function createInventory(book_id, store_id, stock) {
    return new Promise(async (resolve, reject) => {
        const conn = await connection.getConnection(); 
        try {
            await conn.beginTransaction(); 

            const [inventoryResult] = await conn.query(
                'INSERT INTO inventory (book_id, store_id, stock) VALUES (?, ?, ?)',
                [book_id, store_id, stock]
            );

            await conn.commit();
            resolve({ inventoryResult, message: 'Inventario creado' });
        } catch (error) {
            await conn.rollback();
            reject(error);
        } finally {
            conn.release();
        }
    });
}

// Actualizar stock por ID
async function updateInventory(id, stock) {
    const conn = await connection.getConnection();

    try {
        await conn.beginTransaction();

        const [updateResult] = await conn.query(
            'UPDATE inventory SET stock = ? WHERE id = ?',
            [stock, id]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error("Elemento no encontrado");
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

// Eliminar inventario por ID
async function deleteInventory(id) {
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.query('DELETE FROM inventory WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            throw new Error("Entrada no encontrada");
        }

        await conn.commit();
        return { message: "Entrada eliminada correctamente" };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

module.exports = {
    getInventories,
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory
};