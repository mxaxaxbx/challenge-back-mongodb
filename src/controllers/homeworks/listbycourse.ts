import { Request, Response } from 'express';

import { Homework } from '../../models/homeworks';
import { Class } from '../../models/class';

export const listByClass = async (req: Request, res: Response) => {
  try {
    const c = await Class.findById(req.params.class);
    if (!c) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const user = (req as any).context?.user;
    if (user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can list homeworks' });
    }

    // check if teacher is in the course
    const teacherInClass = c.teachers.includes(user.id);
    if (!teacherInClass) {
      return res.status(403).json({ message: 'You are not in this class' });
    }

    const hws = await Homework.find({ class: req.params.class });
    res.status(200).json(hws);
  } catch (error) {
    console.error('An error ocurred trying create homework', error);
    res.status(500).json({ message: 'An error ocurred trying create homework' });
  }
};
