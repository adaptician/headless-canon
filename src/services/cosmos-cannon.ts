import {
    Body,
    ContactEquation,
    SHAPE_TYPES as CANNON_SHAPE_TYPES,
    ShapeType as CannonShapeType,
    Vec3,
    Quaternion,
    Plane, Box, Sphere
} from "cannon-es";
import {SHAPE_TYPES, ShapeType} from "../cosmos/statics";
import {COSMOS} from "../cosmos";
import IVector3 = COSMOS.IVector3;
import IQuaternion = COSMOS.IQuaternion;
import IBody = COSMOS.IBody;
import _ from "lodash";
import IPlaneShape = COSMOS.IPlaneShape;
import IBoxShape = COSMOS.IBoxShape;
import ISphereShape = COSMOS.ISphereShape;
import IMaterial = COSMOS.IMaterial;

export function mapToShapeType(cannonType: CannonShapeType | 0): ShapeType {
    switch (cannonType) {
        case CANNON_SHAPE_TYPES.PLANE:
            return SHAPE_TYPES.PLANE;
        case CANNON_SHAPE_TYPES.BOX:
            return SHAPE_TYPES.BOX;
        case CANNON_SHAPE_TYPES.SPHERE:
            return SHAPE_TYPES.SPHERE;
        default:
            return SHAPE_TYPES.UNKNOWN;
    }
}

export function toCosmosVector3(cannonVector: Vec3): IVector3 {
    return {
        x : cannonVector.x,
        y : cannonVector.y,
        z : cannonVector.z
    } as IVector3;
}

export function toCannonVec3(vector: IVector3): Vec3 {
    return {
        x : vector.x,
        y : vector.y,
        z : vector.z
    } as Vec3;
}

export function toCosmosQuaternion(cannonQuaternion: Quaternion): IQuaternion {
    return {
        x : cannonQuaternion.x,
        y : cannonQuaternion.y,
        z : cannonQuaternion.z, 
        w : cannonQuaternion.w
    } as IQuaternion;
}

export function toCannonQuaternion(quaternion: IQuaternion): Quaternion {
    return {
        x : quaternion.x,
        y : quaternion.y,
        z : quaternion.z,
        w : quaternion.w
    } as Quaternion;
}

// This does not seem to be documented anywhere that is easy to find.
export interface IContactEvent {
    body: Body; // The body involved in the collision
    contact: ContactEquation; // Details about the collision
}

export function getStreamableBody(body: Body): IBody | undefined {
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
}