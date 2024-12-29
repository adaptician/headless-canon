import {Body, ContactMaterial, Material, Plane, SAPBroadphase, Vec3, World } from 'cannon-es';

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
    
    private configure(id: string): void {
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
}