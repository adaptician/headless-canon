import {SHAPE_TYPES as CANNON_SHAPE_TYPES, ShapeType as CannonShapeType, Vec3} from "cannon-es";
import {SHAPE_TYPES, ShapeType} from "../cosmos/statics";
import {IQuaternion, IVector3} from "cosmos/Primitive";
import {Quaternion} from "math/Quaternion";

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