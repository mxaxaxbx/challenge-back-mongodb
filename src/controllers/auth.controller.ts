import { Request, Response } from 'express';

import { User } from '../models/user'

const register = async (req: Request, res: Response) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    
    res.status(200),
    res.json(user);
  } catch (error) {
    console.error('ERROR src/controllers/auth.controller.ts', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  register,
};
