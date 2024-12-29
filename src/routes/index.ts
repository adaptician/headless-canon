import { Router } from 'express';
import { WorldService } from "../services/world.service";
import { WorldController } from "../controllers/worldController";

const router = Router();

// Setup a simple Dependency Injection pattern.
const worldService = new WorldService();
const worldController = new WorldController(worldService);

router.get('/stage', worldController.stage);

export default router;
