import { Request, Response } from 'express';
import {WorldService} from "../services/world.service";

export class WorldController {
    private worldService: WorldService;

    constructor(worldService: WorldService) {
        this.worldService = worldService;
    }

    stage = (req: Request, res: Response) => {
        this.worldService.stage("bobcat");

        res.json({ message: `A world has been staged with ID: ${this.worldService.identify()}` });
    };
}