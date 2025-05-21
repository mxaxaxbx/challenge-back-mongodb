import { Request, Response } from 'express';

import { Class } from '../../models/class';

export const createClass = async (req: Request, res: Response) => {
  try {
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const user = (req as any).context?.user;
    const c = new Class({
      name: req.body.name,
      description: req.body.description,
      students: [],
      teachers: [user.id]
    })

    await c.save();
    res.status(201).json(c);
  } catch (error) {
    console.error('An error ocurred trying create class', error);
    res.status(500).json({ message: 'An error ocurred trying create class' });
  }
};
