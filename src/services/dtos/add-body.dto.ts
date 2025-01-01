import {IsNumber, IsString} from 'class-validator';
import {IMaterial, IQuaternion, IVector3} from "cosmos/Primitive";
import {IBody} from "cosmos/Body";

export class BuildBody implements IBody {
    @IsNumber()
    mass!: number;
    
    @IsString()
    shapeType!: string;
    
    position?: IVector3;
    
    quaternion?: IQuaternion;
    
    material?: IMaterial;
}