import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './User.js';

const Activity = sequelize.define('Activity', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'email'
        }
    },
    activityType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    input: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    output: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'activities'
});

// Set up associations
User.hasMany(Activity, { foreignKey: 'userEmail', sourceKey: 'email' });
Activity.belongsTo(User, { foreignKey: 'userEmail', targetKey: 'email' });

export default Activity;
