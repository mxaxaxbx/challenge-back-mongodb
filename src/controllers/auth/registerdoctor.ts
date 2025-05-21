import { Request, Response } from 'express';

import { User } from '../../models/user';
import { generateHashPassword } from '../../utils/password';


export const registerTeacher = async (req: Request, res: Response) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // check if user already registered
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const hash = await generateHashPassword(req.body.password);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: 'teacher',
    });

    await user.save();

    user.password = '';
    
    res.status(200),
    res.json(user);
  } catch (error) {
    console.error('An error ocurred registering an user', error);
    res.status(500).json({ message: 'An error ocurred registering an user' });
  }
};
