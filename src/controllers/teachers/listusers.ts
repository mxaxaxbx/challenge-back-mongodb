import { Request, Response } from 'express';

import { User } from '../../models/user';

export const listUsers = async (req: Request, res: Response) => {
  try {
    if (!req.query.role) {
      return res.status(400).json({
        message: 'Role is required',
      });
    }

    const users = await User.find({
      role: req.query.role,
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('An error ocurred trying get users', error);
    res.status(500).json({ message: 'An error ocurred trying get users' });
  }
};
