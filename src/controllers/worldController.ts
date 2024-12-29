import { Request, Response } from 'express';
import {WorldService} from "../services/world.service";
import {plainToInstance} from "class-transformer";
import {StageWorld} from "../services/dtos/stageworld.dto";
import {validate} from "class-validator";

export class WorldController {
    private worldService: WorldService;

    constructor(worldService: WorldService) {
        this.worldService = worldService;
    }

    stage = async (req: Request<StageWorld>, res: Response) => {
        const dto = plainToInstance(StageWorld, req.body);

        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        
        this.worldService.stage(dto.id);

        res.json({ message: `A world has been staged with ID: ${this.worldService.identify()}` });
    };
}