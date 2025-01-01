import {IsNumber, IsString} from 'class-validator';
import {IMaterial, IQuaternion, IVector3} from "cosmos/Primitive";
import {IBody, IBuildBody} from "cosmos/Body";
import {IBoxShape, IPlaneShape, ISphereShape} from "cosmos/Shape";

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