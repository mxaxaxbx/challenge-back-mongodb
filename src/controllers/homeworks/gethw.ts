import { Request, Response } from 'express';

import { Homework } from '../../models/homeworks';
import { Class } from '../../models/class';

export const getHW = async (req: Request, res: Response) => {
  try {
    const hw = await Homework.findById(req.params.id);

    if (!hw) {
      return res.status(404).json({ message: 'Homework not found' });
    }

    const c = await Class.findById(hw.class);

    const user = (req as any).context?.user;
    if (user.role === 'teacher') {
      if (!c.teachers.includes(user.id)) {
        res.status(400);
        res.json({
          message: 'You are not in the teachers list'
        });
        return;
      }
    } else if (user.role === 'student') {
      if (!c.students.includes(user.id)) {
        res.status(400);
        res.json({
          message: 'You are not in the students list'
        });
        return;
      }
    }

    res.status(200).json(hw);
  } catch (error) {
    console.error('An error ocurred trying get class', error);
    res.status(500).json({ message: 'An error ocurred trying get class' });
  }
};
