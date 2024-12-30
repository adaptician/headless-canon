import {IBody} from "cosmos/Body";
import {SHAPE_TYPES} from "../../cosmos/statics";
import {Body, Box, Material, Plane, Sphere, Vec3} from "cannon-es";
import {toCannonQuaternion, toCannonVec3} from "../cosmos-cannon";
import _ from "lodash";

export class WorldDeltaService {
    
    private readonly _protoPlane: Plane = new Plane();
    private readonly _protoBox: Box = new Box(new Vec3(1, 1, 1));
    private readonly _protoSphere: Sphere = new Sphere(1);
    
    private readonly _protoMaterial: Material = new Material('default');
    
    buildBody(candidate: IBody): Body {

        // Do NOT clone a body prototype, otherwise id is the same for all bodies.
        let body = new Body({ mass: candidate.mass ?? 1 });
        
        switch (candidate.shapeType) {
            case SHAPE_TYPES.PLANE:
                body.addShape(_.cloneDeep(this._protoPlane));
                break;
            case SHAPE_TYPES.BOX:
                body.addShape(_.cloneDeep(this._protoBox));
                break;
            case SHAPE_TYPES.SPHERE:
                body.addShape(_.cloneDeep(this._protoSphere));
                break;
            case SHAPE_TYPES.UNKNOWN:
            default:
                throw Error('Unable to add UNKNOWN body type');
                
        }

        // Set the initial position
        if (candidate.position) {
            body.position.copy(toCannonVec3(candidate.position));
        }

        if (candidate.quaternion) {
            body.quaternion.copy(toCannonQuaternion(candidate.quaternion));
        }

        body.material = candidate.material ?? _.cloneDeep(this._protoMaterial);
        
        return body;
    }
}