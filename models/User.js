const { DataTypes } = require('sequelize');
const sequelize = require('../app');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name is required',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Invalid email address',
      },
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: {
        args: /^\d{3}-\d{3}-\d{4}$/, // Corrected regular expression
        msg: 'Invalid phone number',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8],
        msg: 'Password must be at least 8 characters',
      },
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['admin', 'vendor', 'customer']],
        msg: 'Role must be either admin, vendor, or customer',
      },
    },
    defaultValue: 'customer',
  },
});

User.beforeCreate(async (user, options) => {
  // Hash password before saving
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  } catch (err) {
    throw err;
  }
});

module.exports = User;