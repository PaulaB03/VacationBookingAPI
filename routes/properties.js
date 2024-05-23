const express = require('express');
const { Property } = require('../sequelize');
const { validateProperty } = require('../middleware/middleware');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();


/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Property created successfully
 *       401:
 *         description: Access denied. No token provided.
 */
router.post('/', authenticateJWT, validateProperty, async (req, res) => {
    const property = await Property.create(req.body);
    res.status(201).send(property);
});

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: List of all properties
 */
router.get('/', async (req, res) => {
    const properties = await Property.findAll();
    res.send(properties);
});

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get a property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 */
router.get('/:id', async (req, res) => {
    const property = await Property.findByPk(req.params.id);
    if (!property) {
        return res.status(404).send({ error: 'Property not found.' });
    }
    res.send(property);
});

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     summary: Update a property by ID
 *     tags: [Properties]
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
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       404:
 *         description: Property not found
 *       401:
 *         description: Access denied. No token provided.
 */
router.put('/:id', authenticateJWT, validateProperty, async (req, res) => {
    const property = await Property.findByPk(req.params.id);
    if (!property) {
        return res.status(404).send({ error: 'Property not found.' });
    }
    await property.update(req.body);
    res.send(property);
});

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     summary: Delete a property by ID
 *     tags: [Properties]
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
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 *       401:
 *         description: Access denied. No token provided.
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
    const property = await Property.findByPk(req.params.id);
    if (!property) {
        return res.status(404).send({ error: 'Property not found.' });
    }
    await property.destroy();
    res.send({ message: 'Property deleted successfully.' });
});

module.exports = router;
