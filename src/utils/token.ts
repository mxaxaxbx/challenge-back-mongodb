import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

export const createToken = (id: string) => {
  const token = jwt.sign({ id }, secret, { expiresIn: '1h' });
  return token;
};

export const validateToken = (token: string) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};
