const express = require('express');
const { Property, Op } = require('../sequelize');
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
 *     summary: Get all properties with optional filters, sorting, and paging
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: capacity
 *         schema:
 *           type: integer
 *         description: Capacity of the properties
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order by price
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of the page
 *     responses:
 *       200:
 *         description: List of all properties
 */
router.get('/', async (req, res) => {
    const { capacity, sort, offset } = req.query;
    const filter = {};
    const order = [];

    if (capacity) {
        filter.capacity = { [Op.eq]: parseInt(capacity, 10) };
    }

    if (sort && (sort === 'asc' || sort === 'desc')) {
        order.push(['price', sort]);
    } else {
        order.push(['price', 'asc']); // Default sorting
    }

    const pagination = {
        limit: 6, 
        offset: offset ? parseInt(offset, 10) : 0 // Default page is 0
    };

    try {
        const properties = await Property.findAll({
            where: filter,
            order: order,
            limit: pagination.limit,
            offset: pagination.offset * pagination.limit
        });
        res.send(properties);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve properties.' });
    }
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
