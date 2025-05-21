import express from 'express';

// import { filesRoutes } from './files.route';
import { authRoutes } from './auth.route';
import { classRoutes } from './classes.route';

const routes = express();

// routes.use( '/api/files', filesRoutes );
routes.use('/api/auth', authRoutes);
routes.use('/api/classes', classRoutes);

export default routes;
