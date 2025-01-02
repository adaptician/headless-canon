import {Body, ContactEquation, SHAPE_TYPES as CANNON_SHAPE_TYPES, ShapeType as CannonShapeType, Vec3, Quaternion} from "cannon-es";
import {SHAPE_TYPES, ShapeType} from "../cosmos/statics";
import {COSMOS} from "../cosmos";
import IVector3 = COSMOS.IVector3;
import IQuaternion = COSMOS.IQuaternion;

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