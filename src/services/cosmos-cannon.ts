import {SHAPE_TYPES as CANNON_SHAPE_TYPES, ShapeType as CannonShapeType} from "cannon-es";
import {SHAPE_TYPES, ShapeType} from "cosmos";

export function mapToShapeType(cannonType: number | 0): /*ShapeType*/ string {
    switch (cannonType) {
        // case CANNON_SHAPE_TYPES.BOX:
        case 4:
            // return SHAPE_TYPES.BOX;
            return 'box';
        // case CANNON_SHAPE_TYPES.SPHERE:
        case 1:
            // return SHAPE_TYPES.SPHERE;
            return 'sphere';
        default:
            return 'unknown';
    }
}