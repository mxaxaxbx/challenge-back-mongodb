import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';

const register = async (req: Request, res: Response) => {
  try {
    const user = await getAuth()
      .createUser({
        email: 'mxaxaxbx@gmail.com',
        emailVerified: false,
        password: 'password',
        displayName: 'Max',
        disabled: false,
      });
    
    res.status(200),
    res.json({ message: 'User created', user });
  } catch (error) {
    console.error('ERROR src/controllers/auth.controller.ts', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  register,
};
