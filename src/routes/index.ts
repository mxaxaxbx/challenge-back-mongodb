import express from 'express';

// import { filesRoutes } from './files.route';
import { authRoutes } from './auth.route';
import { classRoutes } from './classes.route';
import { teachersRouter } from './teachers.route';
import { hwRouter } from './hw.route';
import { poblateRouter } from './poblate.route';

const routes = express();

routes.use('/api/auth', authRoutes);
routes.use('/api/classes', classRoutes);
routes.use('/api/teachers', teachersRouter);
routes.use('/api/homeworks', hwRouter);
routes.use('/api/poblate', poblateRouter);

export default routes;
