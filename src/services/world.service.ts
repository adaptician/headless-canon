import {Body, ContactMaterial, Material, Plane, SAPBroadphase, Sphere, Vec3, World } from 'cannon-es';
import {IBody, IWorld} from "cosmos";

export class WorldService {
    
    private _world : World = new World();
    private _identifier: string = '';
    
    identify(): string {
        return this._identifier;
    }
    
    stage(id: string): void {
        this.configure(id);
        this.makeEarthly();
        this.setDefaultContactMaterial();
        
        this.addFloor();
    }
    
    stream(): IWorld {
        const streamable = {
            bodies: []
        } as IWorld;
        
        return streamable;
    }
    
    private configure(id: string): void {
        this._world = new World();
        
        this._world.broadphase = new SAPBroadphase(this._world);
        this._world.allowSleep = true;
        
        this._identifier = id;
    }
    
    private makeEarthly(): void {        
        this._world.gravity.set(0, - 9.82, 0);  // Earth-like gravity
    }
    
    private setDefaultContactMaterial(): void {
        const defaultMaterial = new Material('default');

        this._world.defaultContactMaterial = new ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                friction: 0.1,
                restitution: 0.7
            }
        );
    }
    
    private addFloor(): void {
        const floorShape = new Plane();
        const floorBody = new Body();
        floorBody.mass = 0;
        floorBody.addShape(floorShape);
        floorBody.quaternion.setFromAxisAngle(new Vec3(- 1, 0, 0), Math.PI * 0.5);
        
        this._world.addBody(floorBody);
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
    
    //#endregion
}