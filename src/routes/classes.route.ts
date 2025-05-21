import express from 'express';

import { authUser } from '../middlewares/auth';

import { createClass } from '../controllers/classes/create';
import { listClasses } from '../controllers/classes/listclasses';
import { enrollUser } from '../controllers/classes/enrolluser';

const router = express.Router();

router.post('/create', authUser, createClass);
router.get('/listclasses', authUser, listClasses);
router.post('/enrolluser', authUser, enrollUser);

export { router as classRoutes };
