import {SHAPE_TYPES as CANNON_SHAPE_TYPES, ShapeType as CannonShapeType} from "cannon-es";
import {SHAPE_TYPES, ShapeType} from "../cosmos/statics";

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