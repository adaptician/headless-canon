import { Router } from 'express';
import { getExample } from '../controllers/worldController';

const router = Router();

router.get('/example', getExample);

export default router;
