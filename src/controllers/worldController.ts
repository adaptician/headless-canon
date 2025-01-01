import {NextFunction, Request, RequestHandler, Response} from 'express';
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {WorldService} from "../services/world/world.service";
import {StageWorld} from "../services/dtos/stage-world.dto";
import {BuildBody} from "../services/dtos/add-body.dto";

export class WorldController {
    private worldService: WorldService;

    constructor(worldService: WorldService) {
        this.worldService = worldService;
    }

    stage: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log(`Request to STAGE ...`);
            const dto = plainToInstance(StageWorld, req.body);

            console.log(`Stage request ${JSON.stringify(dto)}`);
            
            const errors = await validate(dto);
            if (errors.length > 0) {
                res.status(400).json({ errors });
                return;
            }

            this.worldService.stage(dto.id);

            res.json({ message: `A world has been staged with ID: ${this.worldService.identify()}` });
        } catch (error) {
            next(error); // Pass errors to the Express error handler
        }
    };
    
    addBody = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(`Request to ADD BODY ...`);
            const dto = plainToInstance(BuildBody, req.body);

            console.log(`ADD BODY request ${JSON.stringify(dto)}`);

            const errors = await validate(dto);
            if (errors.length > 0) {
                res.status(400).json({ errors });
                return;
            }

            const bodyId = this.worldService.addBody(dto);

            res.json({ message: `Added body with id ${bodyId}` });
        } catch (error) {
            next(error); // Pass errors to the Express error handler
        }
    };

    stream = (req: Request, res: Response) => {
        console.log(`Request to STREAM ...`);
        const stream = this.worldService.stream();

        res.json({ data: stream });
    };

    raw = (req: Request, res: Response) => {
        const stream = this.worldService.raw();

        res.json({ world: stream });
    };
    
    mock = (req: Request, res: Response) => {
        this.worldService.stage("test");
        this.worldService.spawnBubbles();
        this.worldService.spawnLego();

        res.json({ message: `mocking completed.` });
    };
}