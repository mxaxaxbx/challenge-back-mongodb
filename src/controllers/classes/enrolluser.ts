import { Request, Response } from 'express';

import { Class } from '../../models/class';
import { User } from '../../models/user';

export const enrollUser = async (req: Request, res: Response) => {
  try {
    if (!req.body.course_id || !req.body.user_id) {
      res.status(400);
      res.json({
        message: 'user and course are required',
      });
      return;
    }

    const c = await Class.findById(req.body.course_id);

    if (!c) {
      res.status(404);
      res.json({
        message: 'course not found',
      });
      return;
    }

    const u = await User.findById(req.body.user_id);
    if (!u) {
      res.status(404);
      res.json({
        message: 'user not found',
      });
      return;
    }

    // check the user role
    if (u.role == 'student') {
      c.students.push(u._id);
    } else if (u.role == 'teacher') {
      c.teachers.push(u._id);
    }

    await c.save();

    res.status(201).json(c);
  } catch (error) {
    console.error('An error ocurred trying enroll user', error);
    res.status(500).json({ message: 'An error ocurred trying enroll user' });
  }
};
