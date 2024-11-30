import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js'; // Adjust the path as needed

const router = express.Router();

router.get('/protected-endpoint', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;