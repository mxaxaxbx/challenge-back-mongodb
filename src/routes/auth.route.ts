import express from 'express';

import { registerTeacher } from '../controllers/auth/registerteacher';
import { registerStudent } from '../controllers/auth/registerstudent';
import { login } from '../controllers/auth/login';

const router = express.Router();

router.post('/registerteacher', registerTeacher);
router.post('/registerstudent', registerStudent);
router.post('/login', login);

export { router as authRoutes };
