const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone number already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, phoneNumber, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    if (!email && !phoneNumber || !password) {
      return res.status(400).json({ message: 'Email/Phone number and password are required' });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'User logged in successfully', token });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in user', error: error.message });
  }
};