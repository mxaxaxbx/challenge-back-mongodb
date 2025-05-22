import { Request, Response } from 'express';

import { Homework } from '../../models/homeworks';
import { Class } from '../../models/class';

export const qualify = async (req: Request, res: Response) => {
  try {
    if (!req.body.homework || !req.body.score) {
      return res.status(400).json({ message: 'homework and score are required' });
    }

    const hw = await Homework.findById(req.body.homework);
    if (!hw) {
      return res.status(404).json({ message: 'Homework not found' });
    }

    const user = (req as any).context?.user;
    if (user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can qualify homeworks' });
    }

    const c = await Class.findById(hw.class);

    // check if teacher is in the course
    const teacherInCourse = c.teachers.includes(user.id);
    if (!teacherInCourse) {
      return res.status(403).json({ message: 'You are not in this course' });
    }

    if (hw.score > 0) {
      return res.status(400).json({ message: 'Homework already qualified' });
    }

    hw.score = req.body.score;
    hw.teacher = user.id;

    await hw.save();

    res.status(200).json(hw);
  } catch (error) {
    console.error('An error ocurred trying create homework', error);
    res.status(500).json({ message: 'An error ocurred trying create homework' });
  }
};
