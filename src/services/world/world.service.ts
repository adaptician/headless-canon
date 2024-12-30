import {
    Body, 
    Box,
    ContactMaterial, 
    Material, 
    Sphere, 
    Vec3, 
    World 
} from 'cannon-es';
import {
    IBody, 
    IMaterial, 
    IQuaternion, 
    IWorld, 
    IVector3
} from 'cosmos-inf';
import {mapToShapeType} from "../cosmos-cannon";
import {UniformGridService} from "./uniform-grid.service";
import {WorldCreationService} from "./world-creation.service";
import {WorldDeltaService} from "./world-delta.service";


export class WorldService {
    
    private _world : World = new World();
    private _identifier: string = '';
    
    private _stepInterval?: NodeJS.Timeout = undefined;
    
    constructor(private worldCreationService: WorldCreationService,
        private worldDeltaService: WorldDeltaService,
        private uniformGridService: UniformGridService
    ) {
    }
    
    identify(): string {
        return this._identifier;
    }
    
    stage(id: string): void {
        this._world = this.worldCreationService.init();
        
        this.worldCreationService.makeEarthly(this._world);
        this.worldCreationService.setDefaultContactMaterial(this._world);
        
        this.worldCreationService.addFloor(this._world);
        
        this.startStepping();
        
        this._identifier = id;
    }
    
    addBody(candidate: IBody): number {
        const body = this.worldDeltaService.buildBody(candidate);
        
        this._world.addBody(body);
        
        this.uniformGridService.addBodyToGrid(body);
        
        return body.id;
    }
    
    stream(): IWorld {
        const bodies = this._world.bodies.map(body => {
            
            return {
                id: body.id,
                // TODO:T once this has moved to event-driven flow, improve upon this janky code.
                shapeType: mapToShapeType(body.shapes[0].type),
                mass: body.mass,
                material: body.material as IMaterial,
                position: body.position as IVector3,
                quaternion: body.quaternion as IQuaternion
            } as IBody;
        }, []);
        
        const streamable = {
            bodies: bodies
        } as IWorld;
        
        return streamable;
    }
    
    raw(): any {
        return this._world.bodies.map(body => ({
            id: body.id,
            position: body.position,
            quaternion: body.quaternion // For rotation
        }));
    }
    
    
    
    private step(deltaTime: number): void {
        this._world.step(deltaTime);
    }
    
    private startStepping(): void {
        this._stepInterval = setInterval(() => this.step(1 / 60), 1000 / 60);
    }
    
    private stopStepping(): void {
        clearInterval(this._stepInterval);
    }
    
    //#region MOCKING
    
    spawnBubbles(): void {
        const mass = 10;
        const size = 1;
        const height = 5;
        const damping = 0.01;

        const groundMaterial = new Material('ground');
        const sphereShape = new Sphere(size);

        const mat1 = new Material();
        const shapeBody1 = new Body({
            mass,
            material: mat1,
            position: new Vec3(-size * 3, height, size),
        });
        shapeBody1.addShape(sphereShape);
        shapeBody1.linearDamping = damping;
        
        this._world.addBody(shapeBody1);

        const mat2 = new Material();
        const shapeBody2 = new Body({
            mass,
            material: mat2,
            position: new Vec3(0, height, size),
        });
        shapeBody2.addShape(sphereShape);
        shapeBody2.linearDamping = damping;
        
        this._world.addBody(shapeBody2);

        const mat3 = new Material();
        const shapeBody3 = new Body({
            mass,
            material: mat3,
            position: new Vec3(size * 3, height, size),
        });
        shapeBody3.addShape(sphereShape);
        shapeBody3.linearDamping = damping;
        
        this._world.addBody(shapeBody3);

        // Create contact material behaviour
        const mat1_ground = new ContactMaterial(groundMaterial, mat1, { friction: 0.0, restitution: 0.0 });
        const mat2_ground = new ContactMaterial(groundMaterial, mat2, { friction: 0.0, restitution: 0.7 });
        const mat3_ground = new ContactMaterial(groundMaterial, mat3, { friction: 0.0, restitution: 0.9 });

        this._world.addContactMaterial(mat1_ground);
        this._world.addContactMaterial(mat2_ground);
        this._world.addContactMaterial(mat3_ground);
    }
    
    spawnLego(): void {
        const mass = 10;
        const damping = 0.01;

        const groundMaterial = new Material('ground');
        const boxShape = new Box(new Vec3(2, 2, 2));

        const mat1 = new Material();
        const shapeBody1 = new Body({
            mass,
            material: mat1,
            position: new Vec3(5, 5, 5),
        });
        shapeBody1.addShape(boxShape);
        shapeBody1.linearDamping = damping;

        this._world.addBody(shapeBody1);

        const mat1_ground = new ContactMaterial(groundMaterial, mat1, { friction: 0.0, restitution: 0.0 });
    }
    
    //#endregion
}