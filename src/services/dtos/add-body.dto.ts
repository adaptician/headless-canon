import {IsNumber, IsString} from 'class-validator';
import {COSMOS} from "../../cosmos";
import IBuildBody = COSMOS.IBuildBody;
import IVector3 = COSMOS.IVector3;
import IQuaternion = COSMOS.IQuaternion;
import IMaterial = COSMOS.IMaterial;
import IPlaneShape = COSMOS.IPlaneShape;
import IBoxShape = COSMOS.IBoxShape;
import ISphereShape = COSMOS.ISphereShape;

export class BuildBody implements IBuildBody {
    @IsNumber()
    mass!: number;
    
    @IsString()
    shapeType!: string;
    
    position?: IVector3;
    
    quaternion?: IQuaternion;
    
    material?: IMaterial;

    shapeOptions?: IPlaneShape | IBoxShape | ISphereShape;
}