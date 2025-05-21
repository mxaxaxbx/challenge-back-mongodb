import { Request, Response } from 'express';

import { User } from '../../models/user';
import { createToken } from '../../utils/token';


export const login = async (req: Request, res: Response) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // check if user already registered
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user.id);
    
    res.status(200),
    res.json({
      access_token: token,
    });
  } catch (error) {
    console.error('An error ocurred trying login', error);
    res.status(500).json({ message: 'An error ocurred trying login' });
  }
};
