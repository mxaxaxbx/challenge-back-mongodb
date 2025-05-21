import express from 'express';

import { authUser } from '../middlewares/auth';

import { createClass } from '../controllers/classes/create';

const router = express.Router();

router.post('/create', authUser, createClass);

export { router as classRoutes };
