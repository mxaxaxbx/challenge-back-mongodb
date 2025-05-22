import express from 'express';

import { poblate } from '../controllers/poblate/poblate';

const router = express.Router();

router.post('', poblate);

export { router as poblateRouter };
