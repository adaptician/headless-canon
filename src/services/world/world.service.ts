import {
    Body,
    Box,
    ContactMaterial,
    Material, Plane,
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
import {WorldCreationService} from "./world-creation.service";
import {WorldDeltaService} from "./world-delta.service";
import {SHAPE_TYPES} from "../../cosmos/statics";
import {IBoxShape, IPlaneShape, ISphereShape} from "cosmos/Shape";
import _ from "lodash";


export class WorldService {
    
    private _world : World = new World();
    private _identifier: string = '';
    
    private _stepInterval?: NodeJS.Timeout = undefined;
    
    constructor(private worldCreationService: WorldCreationService,
        private worldDeltaService: WorldDeltaService
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
        
        return body.id;
    }
    
    stream(): IWorld {
        const bodies = this._world.bodies.map(body => {
            const firstShape = (body.shapes?.length ?? 0) > 0 ? body.shapes[0] : null;
            
            if (!firstShape) {
                console.log(`Unable to map body without a shape ${JSON.stringify(body)}`);
                // Don't break the stream for one invalid body. Continue to the next.
                return;
            }
            
            const shapeType = mapToShapeType(firstShape.type);
            
            let shapeOptions = null;   
            let scale;
            switch (shapeType) {
                case SHAPE_TYPES.PLANE:
                    const plane = _.clone(firstShape) as Plane;
                    
                    shapeOptions = {
                        // In Cannon, the plane is infinite, and does not provide width and height; setting generous defaults.
                        width: 10,
                        height: 10,
                        colorHexCode: 0xeeeecc
                    } as IPlaneShape;
                    
                    scale = { x: 10, y: 10, z: 0 } as IVector3;
                    
                    break;
                case SHAPE_TYPES.BOX:
                    const box = _.clone(firstShape) as Box;
                    
                    shapeOptions = {
                        width: box.halfExtents.x,
                        height: box.halfExtents.y,
                        depth: box.halfExtents.z,
                        colorHexCode: 0xffae00
                    } as IBoxShape;

                    scale = {
                        x: body.aabb.lowerBound.x - body.aabb.upperBound.x,
                        y: body.aabb.lowerBound.y - body.aabb.upperBound.y,
                        z: body.aabb.lowerBound.z - body.aabb.upperBound.z
                    } as IVector3;
                    
                    break;
                case SHAPE_TYPES.SPHERE:
                    const sphere = _.clone(firstShape) as Sphere;
                    
                    shapeOptions = {
                        radius: sphere.radius,
                        colorHexCode: 0x003cff
                    } as ISphereShape;

                    scale = {
                        x: body.aabb.lowerBound.x - body.aabb.upperBound.x,
                        y: body.aabb.lowerBound.y - body.aabb.upperBound.y,
                        z: body.aabb.lowerBound.z - body.aabb.upperBound.z
                    } as IVector3;
                    
                    break;
                case SHAPE_TYPES.UNKNOWN:
                default:
                    return;
            }
            
            return {
                id: body.id,
                shapeType: shapeType,
                shapeOptions: shapeOptions,
                mass: body.mass,
                material: body.material as IMaterial,
                position: body.position as IVector3,
                quaternion: body.quaternion as IQuaternion,
                scale: scale
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