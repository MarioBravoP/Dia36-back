// Get the client
const connection = require('../connection');

// Obtener todas las tiendas
async function getStores() {
    const conn = await connection.getConnection();
    try {
        const [stores] = await conn.query(`
            SELECT 
                s.id AS store_id,
                s.name AS store_name,
                s.city AS store_city
            FROM stores s
        `);
        return stores;
    } finally {
        conn.release();
    }
}

// Obtener una tienda por id, sus libros y el stock
async function getStore(id) {
    const conn = await connection.getConnection();
    try {
        const [stores] = await conn.query(`
            SELECT 
                s.id AS store_id, 
                s.name AS store_name, 
                s.city AS store_city, 
                s.address AS store_address,
                b.id AS book_id, 
                b.name AS book_name,
                i.stock AS book_stock
            FROM stores s
            LEFT JOIN inventory i ON s.id = i.store_id
            LEFT JOIN books b ON i.book_id = b.id
            WHERE s.id = ?
        `, [id]);

        if (stores.length === 0) {
            throw new Error("Tienda no encontrada");
        }

        const store = {
            id: stores[0].store_id,
            name: stores[0].store_name,
            city: stores[0].store_city,
            address: stores[0].store_address,
            books: []
        };

        for (const storeRow of stores) {
            if (storeRow.book_id) {
                store.books.push({
                    id: storeRow.book_id,
                    name: storeRow.book_name,
                    stock: storeRow.book_stock
                });
            }
        }

        return store;
    } finally {
        conn.release();
    }
}

module.exports = {
    getStores,
    getStore,
};