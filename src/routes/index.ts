import { Router } from 'express';
import { WorldController } from "../controllers/worldController";
import {WorldService} from "../services/world/world.service";
import {UniformGridService} from "../services/world/uniform-grid.service";
import {WorldCreationService} from "../services/world/world-creation.service";

const router = Router();

// Use a simple Dependency Injection pattern.
const uniformGridService = new UniformGridService();
const worldCreationService = new WorldCreationService();
const worldService = new WorldService(worldCreationService, uniformGridService);

const worldController = new WorldController(worldService);

router.post('/stage', worldController.stage);

router.get('/stream', worldController.stream);
router.get('/raw', worldController.raw);

router.post('/mock', worldController.mock);

export default router;
