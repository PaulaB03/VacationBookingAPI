const express = require('express');
const { User } = require('../sequelize');
const { validateUserUpdate } = require('../middleware/middleware');
const authenticateJWT = require('../middleware/authenticateJWT');
const bcrypt = require('bcryptjs');

const router = express.Router();

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       401:
 *         description: Access denied. No token provided.
 */
router.get('/:id', authenticateJWT, async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).send({ error: 'User not found.' });
    }
    res.send(user);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 *       401:
 *         description: Access denied. No token provided.
 */
router.put('/:id', authenticateJWT, validateUserUpdate, async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).send({ error: 'User not found.' });
    }

    const { password, firstName, lastName, phoneNumber } = req.body;

    // If a new password is provided, hash it before updating
    let hashedPassword = user.password;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber
    });

    res.send(user);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Access denied. No token provided.
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).send({ error: 'User not found.' });
    }
    await user.destroy();
    res.send({ message: 'User deleted successfully.' });
});

module.exports = router;
