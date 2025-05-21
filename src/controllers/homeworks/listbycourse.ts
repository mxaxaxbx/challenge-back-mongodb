import { Request, Response } from 'express';

import { Homework } from '../../models/homeworks';
import { Class } from '../../models/class';

export const listByCourse = async (req: Request, res: Response) => {
  try {
    const c = await Class.findById(req.params.course);
    if (!c) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = (req as any).context?.user;
    if (user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can list homeworks' });
    }

    // check if teacher is in the course
    const teacherInCourse = c.teachers.includes(user.id);
    if (!teacherInCourse) {
      return res.status(403).json({ message: 'You are not in this course' });
    }

    const hws = await Homework.find({ course: req.params.course });
    res.status(200).json(hws);
  } catch (error) {
    console.error('An error ocurred trying create homework', error);
    res.status(500).json({ message: 'An error ocurred trying create homework' });
  }
};
