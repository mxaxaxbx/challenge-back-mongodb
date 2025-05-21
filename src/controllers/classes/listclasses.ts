import { Request, Response } from 'express';

import { Class } from '../../models/class';

export const listClasses = async (req: Request, res: Response) => {
  try {
    
    const classes = await Class.find();

    res.status(200).json(classes);
  } catch (error) {
    console.error('An error ocurred trying list classes', error);
    res.status(500).json({ message: 'An error ocurred trying list classes' });
  }
};
