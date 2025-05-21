import express from 'express';

import { registerTeacher } from '../controllers/auth/registerdoctor';
import { login } from '../controllers/auth/login';

const router = express.Router();

router.post('/registerteacher', registerTeacher);
router.post('/login', login);

export { router as authRoutes };
