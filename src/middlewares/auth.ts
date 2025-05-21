import { NextFunction, Request, Response } from 'express';

import { validateToken } from '../utils/token';

import { User } from '../models/user';

export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      message: 'include token in headers',
    });
  }

  const [, token] = authToken.split(' ');

  try {
    const { id } = validateToken(token);

    const user = await User.findById(id);
    if (!user)
      return res.status(401).json({
        message: 'Invalid token',
      });

    (req as any).context = (req as any).context || {};
    (req as any).context.user = user;

    return next();
  } catch (err) {
    console.error('Invalid token', err);
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
}
