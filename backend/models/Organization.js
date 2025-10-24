const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  primary_admin_name: {
    type: DataTypes.STRING(255)
  },
  primary_admin_email: {
    type: DataTypes.STRING(255),
    validate: {
      isEmail: true
    }
  },
  contact: {
    type: DataTypes.STRING(50)
  },
  phone: {
    type: DataTypes.STRING(50)
  },
  alternate_phone: {
    type: DataTypes.STRING(50)
  },
  website: {
    type: DataTypes.STRING(255)
  },
  logo_url: {
    type: DataTypes.STRING(500)
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'blocked', 'inactive']]
    }
  },
  max_coordinators: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  timezone: {
    type: DataTypes.STRING(100)
  },
  region: {
    type: DataTypes.STRING(100)
  },
  language: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'organizations',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Organization;
