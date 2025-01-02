import {SHAPE_TYPES} from "../../cosmos/statics";
import {Body, Box, Material, Plane, Sphere, Vec3} from "cannon-es";
import {IContactEvent, toCannonQuaternion, toCannonVec3} from "../cosmos-cannon";
import _ from "lodash";
import {UniformGridService} from "./uniform-grid.service";
import {COSMOS} from "../../cosmos";
import IBuildBody = COSMOS.IBuildBody;
import IBoxShape = COSMOS.IBoxShape;
import IPlaneShape = COSMOS.IPlaneShape;
import ISphereShape = COSMOS.ISphereShape;

export class WorldDeltaService {
        
    private readonly _protoMaterial: Material = new Material('default');
    
    constructor(private uniformGridService: UniformGridService) {
    }
    
    buildBody(candidate: IBuildBody): Body {

        // Do NOT clone a body prototype, otherwise id is the same for all bodies.
        let body = new Body({ mass: candidate.mass ?? 1 });
        let shape;
        
        switch (candidate.shapeType) {
            case SHAPE_TYPES.PLANE:
                const planeOptions = _.cloneDeep(candidate.shapeOptions) as IPlaneShape;
                shape = new Plane();
                
                body.addShape(shape);
                break;
            case SHAPE_TYPES.BOX:
                const boxOptions = _.cloneDeep(candidate.shapeOptions) as IBoxShape;
                shape = new Box(new Vec3(boxOptions.width, boxOptions.height, boxOptions.depth));
                
                body.addShape(shape);
                break;
            case SHAPE_TYPES.SPHERE:
                const sphereOptions = _.cloneDeep(candidate.shapeOptions) as ISphereShape;
                shape = new Sphere(sphereOptions.radius);
                
                body.addShape(shape);
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

        // TODO:T this is the end goal-ish - from Honours
        // body.addEventListener('collide', eventsMap['collide']);
        // Bind to ensure `this` context is carried through.
        // eg. this.uniformGridService.updateBodyFromCollision.bind(this.uniformGridService)
        // Alternatively, use arrow function.
        body.addEventListener('collide', (collision: IContactEvent) => { 
            this.uniformGridService.updateBodyFromCollision(collision); 
        });

        this.uniformGridService.addBodyToGrid(body);
        
        return body;
    }
}