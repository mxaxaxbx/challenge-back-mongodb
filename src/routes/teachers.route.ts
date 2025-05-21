import express from 'express';

import { authUser } from '../middlewares/auth';

import { listUsers } from '../controllers/teachers/listusers';

const router = express.Router();

router.get('/listusers', authUser, listUsers);

export { router as teachersRouter };
