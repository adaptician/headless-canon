import { Router } from 'express';
import { WorldService } from "../services/world.service";
import { WorldController } from "../controllers/worldController";

const router = Router();

// Use a simple Dependency Injection pattern.
const worldService = new WorldService();
const worldController = new WorldController(worldService);

router.post('/stage', worldController.stage);

router.get('/stream', worldController.stream);

router.post('/mock', worldController.mock);

export default router;
