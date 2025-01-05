import { Router } from 'express';
import { WorldController } from "../controllers/worldController";
import {WorldService} from "../services/world/world.service";
import {UniformGridService} from "../services/world/uniform-grid.service";
import {WorldCreationService} from "../services/world/world-creation.service";
import {WorldDeltaService} from "../services/world/world-delta.service";
import {EventBusService} from "../services/event-bus/event-bus.service";

const router = Router();

// Use a simple Dependency Injection pattern.
const eventBusService = new EventBusService();
const uniformGridService = new UniformGridService(eventBusService);
const worldDeltaService = new WorldDeltaService(uniformGridService);
const worldCreationService = new WorldCreationService();
const worldService = new WorldService(worldCreationService, worldDeltaService);

const worldController = new WorldController(worldService);

router.post('/stage', worldController.stage);
router.post('/addBody', worldController.addBody);

// WIP
router.get('/stream', worldController.stream);
router.get('/raw', worldController.raw);

router.post('/mock', worldController.mock);

export default router;
