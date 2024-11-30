import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ACCESTS_TOKEN_SECRET;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // No token provided
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// import jwt from 'jsonwebtoken';

// const verifyToken = (req, res, next) => {
//   const token = req.cookies.auth_token || req.headers['authorization'];
//   if (!token) return res.status(401).send('Access Denied');

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next(); // Proceed to the next middleware or route handler
//   } catch (err) {
//     res.status(400).send('Invalid Token');
//   }
// };

// export default verifyToken;
// import jwt from 'jsonwebtoken';

// const verifyToken = (req, res, next) => {
//   const token = req.cookies.auth_token || req.headers['authorization'];
//   if (!token) return res.status(401).send('Access Denied');

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).send('Invalid Token');
//   }
// };

// export default verifyToken;

// middleware/authMiddleware.js
