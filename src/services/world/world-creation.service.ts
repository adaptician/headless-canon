import {Body, Box, ContactMaterial, Material, Plane, SAPBroadphase, Vec3, World} from "cannon-es";

export class WorldCreationService {


    init(): World {
        let world = new World();

        world.broadphase = new SAPBroadphase(world);
        world.allowSleep = true;

        return world;
    }

    makeEarthly(world: World): void {
        // world.gravity.set(0, - 9.82, 0);  // Earth-like gravity
        world.gravity.set(0, -100, 0);  // less bouncy
    }

    setDefaultContactMaterial(world: World): void {
        const defaultMaterial = new Material('default');

        world.defaultContactMaterial = new ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                friction: 0.1,
                restitution: 0.7
            }
        );
    }

    addFloor(world: World): void {
        const floorShape = new Plane();
        const floorBody = new Body();
        floorBody.mass = 0;
        floorBody.addShape(floorShape);
        // Make it face upwards.
        floorBody.quaternion.setFromAxisAngle(new Vec3(- 1, 0, 0), Math.PI * 0.5);

        world.addBody(floorBody);
    }
}