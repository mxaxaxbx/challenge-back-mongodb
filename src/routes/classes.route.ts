import express from 'express';

import { authUser } from '../middlewares/auth';

import { createClass } from '../controllers/classes/create';
import { listClasses } from '../controllers/classes/listclasses';
import { getClass } from '../controllers/classes/getclass';
import { enrollUser } from '../controllers/classes/enrolluser';
import { classSummary } from '../controllers/classes/summary';

const router = express.Router();

router.post('/create', authUser, createClass);
router.get('/listclasses', authUser, listClasses);
router.get('/getclass/:id', authUser, getClass);
router.post('/enrolluser', authUser, enrollUser);
router.get('/summary/:id', authUser, classSummary);

export { router as classRoutes };
