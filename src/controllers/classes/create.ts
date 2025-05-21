import { Request, Response } from 'express';

export const createClass = async (req: Request, res: Response) => {
  try {
    const user = (req as any).context?.user;
    console.log('user', user);
    res.status(200),
    res.json({
      access_token: 'token',
    });
  } catch (error) {
    console.error('An error ocurred trying login', error);
    res.status(500).json({ message: 'An error ocurred trying login' });
  }
};
