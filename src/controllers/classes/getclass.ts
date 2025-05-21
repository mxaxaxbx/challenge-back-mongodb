import { Request, Response } from 'express';

import { Class } from '../../models/class';

export const getClass = async (req: Request, res: Response) => {
  try {
    
    const c = await Class.findById(req.params.id);

    if (!c) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json(c);
  } catch (error) {
    console.error('An error ocurred trying get class', error);
    res.status(500).json({ message: 'An error ocurred trying get class' });
  }
};
