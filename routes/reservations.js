const express = require('express');
const { Reservation, Property, Op } = require('../sequelize');
const { validateReservation } = require('../middleware/middleware');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: integer
 *               arrivalTime:
 *                 type: string
 *               departureTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Access denied. No token provided.
 */
router.post('/', authenticateJWT, validateReservation, async (req, res) => {
    const { propertyId, arrivalTime, departureTime } = req.body;

    // Check if departureTime is after arrivalTime
    if (new Date(departureTime) <= new Date(arrivalTime)) {
        return res.status(400).send({ error: 'departureTime must be after arrivalTime.' });
    }

    // Check if the property is already booked for the requested dates
    const existingReservations = await Reservation.findAll({
        where: {
            propertyId,
            arrivalTime: { [Op.lt]: departureTime },
            departureTime: { [Op.gt]: arrivalTime }
        }
    });

    if (existingReservations.length > 0) {
        return res.status(400).send({ error: 'The property is already booked for the requested dates.' });
    }

    // Ensure PropertyId is assigned correctly
    const reservation = await Reservation.create({
        PropertyId: propertyId,
        arrivalTime,
        departureTime,
        UserId: req.user.userId
    });

    res.status(201).send(reservation);
});

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of all reservations
 *       401:
 *         description: Access denied. No token provided.
 */
router.get('/', authenticateJWT, async (req, res) => {
    const reservations = await Reservation.findAll({ where: { UserId: req.user.userId } });
    res.send(reservations);
});

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation details
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Access denied. No token provided.
 */
router.get('/:id', authenticateJWT, async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
        return res.status(404).send({ error: 'Reservation not found.' });
    }
    res.send(reservation);
});

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update a reservation by ID
 *     tags: [Reservations]
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
 *               arrivalTime:
 *                 type: string
 *               departureTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Access denied. No token provided.
 */
router.put('/:id', authenticateJWT, validateReservation, async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
        return res.status(404).send({ error: 'Reservation not found.' });
    }

    const { arrivalTime, departureTime } = req.body;

    // Check if departureTime is after arrivalTime
    if (new Date(departureTime) <= new Date(arrivalTime)) {
        return res.status(400).send({ error: 'departureTime must be after arrivalTime.' });
    }

    // Check if the property is already booked for the requested dates
    const existingReservations = await Reservation.findAll({
        where: {
            propertyId: reservation.PropertyId, // Use the existing propertyId from the reservation
            arrivalTime: { [Op.lt]: departureTime },
            departureTime: { [Op.gt]: arrivalTime },
            id: { [Op.ne]: reservation.id }
        }
    });

    if (existingReservations.length > 0) {
        return res.status(400).send({ error: 'The property is already booked for the requested dates.' });
    }

    await reservation.update({
        arrivalTime,
        departureTime
    });

    res.send(reservation);
});

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Access denied. No token provided.
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
        return res.status(404).send({ error: 'Reservation not found.' });
    }
    await reservation.destroy();
    res.send({ message: 'Reservation deleted successfully.' });
});

module.exports = router;
