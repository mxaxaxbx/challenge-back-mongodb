import express from 'express';

import { authUser } from '../middlewares/auth';

import { createHomework } from '../controllers/homeworks/create';
import { listByCourse } from '../controllers/homeworks/listbycourse';

const router = express.Router();

router.post('/create', authUser, createHomework);
router.get('/listbycourse/:course', authUser, listByCourse);

export { router as hwRouter };
