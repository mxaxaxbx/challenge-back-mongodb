import express from 'express';

import { authUser } from '../middlewares/auth';

import { createHomework } from '../controllers/homeworks/create';
import { listByCourse } from '../controllers/homeworks/listbycourse';
import { qualify } from '../controllers/homeworks/qualify';

const router = express.Router();

router.post('/create', authUser, createHomework);
router.get('/listbycourse/:course', authUser, listByCourse);
router.post('/qualify', authUser, qualify);

export { router as hwRouter };
