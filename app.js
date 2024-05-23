const { sequelize, User } = require('./sequelize');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { swaggerSpec, swaggerUi } = require('./swagger');
const { validateUser } = require('./middleware/middleware');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/users');
const propertyRoutes = require('./routes/properties');
const reservationRoutes = require('./routes/reservations');

app.use('/users', userRoutes);
app.use('/properties', propertyRoutes);
app.use('/reservations', reservationRoutes);

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration failed
 */
app.post('/signup', validateUser, async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber
        });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).send({ user: { id: user.id, email: user.email }, token });
    } catch (error) {
        res.status(400).send({ error: 'Registration failed. Please try again.' });
    }
});

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Login an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Login failed
 *       400:
 *         description: Login failed
 */
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials.' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.send({ user: { id: user.id, email: user.email }, token });
    } catch (error) {
        res.status(400).send({ error: 'Login failed.' });
    }
});

// Swagger setup
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sync with the database, start express app
sequelize.sync().then(() => {
    console.log('Database & tables created!');

    app.listen(port, () => {
        console.log(`App running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Unable to sync the database:', error);
});

module.exports = app;
