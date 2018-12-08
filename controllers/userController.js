const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  add: async (req, res) => {   
    const { name, password } = req.body;
    const user = new User({ name, password }); // document = instance of a model
    try {
      await user.save();
      res.status(201).send({data: user});
    } catch (err) {
      res.status(400).send({errors: err.message});
    }
  },

  findAll: async (req, res) => {
    try {
      // const payload = req.decoded;
      const users = await User.find();
      res.status(201).send({data: users});
    } catch (err) {
      res.status(400).send({errors: err.message});
    }
  },

  login: async (req, res) => {
    const { name, password } = req.body;

    try {
      const user = await User.findOne({name});
      const isOk = await bcrypt.compare(password, user.password);
      if (isOk) {
        // Create a token
        const payload = { user: user.name };
        const options = { expiresIn: '2d', issuer: 'marianoselvaggi' };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, options);

        res.status(201).send({message: 'User authenticated', token: token, data: user});
      } else {        
        res.status(401).send('Auth error');      
      }
    } catch (err) {
      res.status(400).send({errors: err.message});
    }
  }
}