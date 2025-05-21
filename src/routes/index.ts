import express from 'express';

// import { filesRoutes } from './files.route';
import { authRoutes } from './auth.route';

const routes = express();

// routes.use( '/api/files', filesRoutes );
routes.use( '/api/auth', authRoutes );

export default routes;
