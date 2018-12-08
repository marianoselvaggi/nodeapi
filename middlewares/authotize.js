const jwt = require('jsonwebtoken');

module.exports = {
  validateToken: (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    let result;
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      const options = {
        expires: '2d',
        issuer: 'marianoselvaggi'
      };
      try {
        result = jwt.verify(token, process.env.JWT_SECRET, options);

        req.decoded = result;
        next();
      } catch (err) {
        throw err;
      }
    } else {
      res.status(404).send({errors: 'not authorized'});
    }
  }
};