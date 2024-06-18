import sequelize from '../db.js';

const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Use { force: true } to drop tables before re-creating them. Remove or change to { alter: true } in production.
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to synchronize the database:', error);
    }
};

initializeDatabase();
