const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, logUser, getUsers, updateUser, deleteUser } = require('../models/userModel')

exports.getUsers = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

exports.registerUser = async (req, res) => {
    try {
        const { userName, realName, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);

        await createUser( userName, realName, hashedPassword, 0 );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El username ya está en uso' });
        }

        res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const user = await logUser(userName);
        if (!user) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        delete user.password;

        const token = jwt.sign(
            { id: user.id, userName: user.userName },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );

        res.status(200).json({ message: 'Login correcto', token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { realName, isAdmin } = req.body;
        const { id } = req.params;

        await updateUser(realName, isAdmin, id);

        res.status(200).json({ message: 'Usuario actualizado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await deleteUser(id);

        res.status(200).json({ message: 'Usuario eliminado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}