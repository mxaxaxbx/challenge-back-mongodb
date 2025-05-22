import { Request, Response } from 'express';

import { Homework } from '../../models/homeworks';
import { Class } from '../../models/class';

export const createHomework = async (req: Request, res: Response) => {
  try {
    if (!req.body.content || !req.body.class) {
      return res.status(400).json({ message: 'Course and content are required' });
    }

    const c = await Class.findById(req.body.class);
    if (!c) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = (req as any).context?.user;
    if (user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can create homeworks' });
    }

    // check if student is in the course
    const studentInClass = c.students.includes(user.id);
    if (!studentInClass) {
      return res.status(403).json({ message: 'You are not in this course' });
    }

    const hw = new Homework({
      content: req.body.content,
      class: req.body.class,
      student: user.id,
      teacher: null,
      score: 0.0,
    });

    await hw.save();
    
    res.status(201).json(hw);
  } catch (error) {
    console.error('An error ocurred trying create homework', error);
    res.status(500).json({ message: 'An error ocurred trying create homework' });
  }
};
