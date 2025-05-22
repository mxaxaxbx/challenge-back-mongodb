import express from 'express';

import { authUser } from '../middlewares/auth';

import { createHomework } from '../controllers/homeworks/create';
import { listByClass } from '../controllers/homeworks/listbycourse';
import { getHW } from '../controllers/homeworks/gethw';
import { qualify } from '../controllers/homeworks/qualify';

const router = express.Router();

router.post('/create', authUser, createHomework);
router.get('/listbyclass/:class', authUser, listByClass);
router.get('/:id', authUser, getHW);
router.post('/qualify', authUser, qualify);

export { router as hwRouter };
