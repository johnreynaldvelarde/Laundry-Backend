import jwt from 'jsonwebtoken';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';

export const handleRefreshToken = async (req, res, refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    // Generate a new access token
    const accessToken = createToken({ userId }, JWT_SECRET, JWT_EXPIRES_IN);

    return res.status(200).json({ success: true, accessToken });
  } catch (err) {
    console.error('Error handling refresh token:', err);
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
  }
};
