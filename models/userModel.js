// Get the client
const connection = require('../connection');

// Obtener todos los usuarios
async function getUsers() {
    const conn = await connection.getConnection();
    try {
        const [users] = await conn.query(`
            SELECT 
                u.id, u.userName, u.realName, u.isAdmin
            FROM users u
        `);

        return users;
    } finally {
        conn.release();
    }
}

// Logear Usuario por Username
async function logUser(userName) {
    const conn = await connection.getConnection();
    try {
        const [rows] = await conn.query(
            'SELECT * FROM users WHERE userName = ?',
            [userName]
        );

        return rows.length > 0 ? rows[0] : null; 
    } finally {
        conn.release();
    }
}

// Crear un nuevo usuario
async function createUser(userName, realName, password, isAdmin) {
    return new Promise(async (resolve, reject) => {
        const conn = await connection.getConnection(); 
        try {
            await conn.beginTransaction(); 

            await conn.query(
                'INSERT INTO users (userName, realName, password, isadmin) VALUES (?, ?, ?, ?)',
                [userName, realName, password, isAdmin]
            );

            await conn.commit();
            resolve({ message: 'Usuario creado con éxito' });
        } catch (error) {
            await conn.rollback();
            reject(error);
        } finally {
            conn.release();
        }
    });
}

// Actualizar usuario por ID
async function updateUser(realName, isAdmin, id) {
    const conn = await connection.getConnection();

    try {
        await conn.beginTransaction();

        const [updateResult] = await conn.query(
            'UPDATE users SET realName = ?, isAdmin = ? WHERE id = ?',
            [realName, isAdmin, id]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error("Usuario no encontrado");
        }

        await conn.commit();
        return { bookId: id, message: 'Usuario actualizado correctamente' };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

// Eliminar usuario por ID
async function deleteUser(id) {
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            throw new Error("Usuario no encontrado");
        }

        await conn.commit();
        return { message: "Usuario eliminado correctamente" };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

module.exports = {
    getUsers,
    logUser,
    createUser,
    updateUser,
    deleteUser
};