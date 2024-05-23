const { Sequelize, DataTypes, Op } = require('sequelize'); // Add Op here
require('dotenv').config();

// Connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);
// Models
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false }
});

const Property = sequelize.define('Property', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false }
});

const Reservation = sequelize.define('Reservation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    arrivalTime: { type: DataTypes.DATE, allowNull: false },
    departureTime: { type: DataTypes.DATE, allowNull: false }
});

// Relationships
User.hasMany(Reservation, { foreignKey: { allowNull: false } });
Property.hasMany(Reservation, { foreignKey: { allowNull: false } });

Reservation.belongsTo(User, { foreignKey: { allowNull: false } });
Reservation.belongsTo(Property, { foreignKey: { allowNull: false } });

// Exports
module.exports = { sequelize, User, Property, Reservation, Op }; // Add Op here
