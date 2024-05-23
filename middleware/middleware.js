const { body, validationResult } = require('express-validator');

const validateUser = [
    body('email')
        .isEmail().withMessage('Must be a valid email')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage('Must be a valid email format'),
    body('password')
        .isLength({ min: 10 }).withMessage('Password must be at least 10 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserUpdate = [
    body('password')
        .optional()
        .isLength({ min: 10 }).withMessage('Password must be at least 10 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array()); // Log validation errors
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateProperty = [
    body('name').notEmpty().withMessage('Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('capacity').isInt({ gt: 0 }).withMessage('Capacity must be a positive integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateReservation = [
    body('arrivalTime').isISO8601().withMessage('Must be a valid date'),
    body('departureTime').isISO8601().withMessage('Must be a valid date'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateUser, validateUserUpdate, validateProperty, validateReservation };
