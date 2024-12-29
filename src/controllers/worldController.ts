import { Request, Response } from 'express';
import {WorldService} from "../services/world.service";
import {plainToInstance} from "class-transformer";
import {StageWorld} from "../services/dtos/stageworld.dto";

export class WorldController {
    private worldService: WorldService;

    constructor(worldService: WorldService) {
        this.worldService = worldService;
    }

    stage = (req: Request<StageWorld>, res: Response) => {
        const dto = plainToInstance(StageWorld, req.body);
        
        this.worldService.stage(dto.id);

        res.json({ message: `A world has been staged with ID: ${this.worldService.identify()}` });
    };
}