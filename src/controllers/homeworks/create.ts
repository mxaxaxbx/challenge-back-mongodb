import { Request, Response } from 'express';

import { Homework } from '../../models/homeworks';
import { Class } from '../../models/class';

export const createHomework = async (req: Request, res: Response) => {
  try {
    if (!req.body.content || !req.body.course) {
      return res.status(400).json({ message: 'Course and content are required' });
    }

    const c = await Class.findById(req.body.course);
    if (!c) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = (req as any).context?.user;
    if (user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can create homeworks' });
    }

    // check if student is in the course
    const studentInCourse = c.students.includes(user.id);
    if (!studentInCourse) {
      return res.status(403).json({ message: 'You are not in this course' });
    }

    const hw = new Homework({
      content: req.body.content,
      course: req.body.course,
      student: user.id,
      teacher: null,
      rating: 0.0,
    });

    await hw.save();
    
    res.status(201).json(hw);
  } catch (error) {
    console.error('An error ocurred trying create homework', error);
    res.status(500).json({ message: 'An error ocurred trying create homework' });
  }
};
