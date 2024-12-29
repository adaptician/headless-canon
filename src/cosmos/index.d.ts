
declare module "cosmos/Shape" {
    import {IMaterial} from "cosmos/Primitive";
    import {ShapeType} from "./statics";
    
    export interface IShape {
        id: number;
        type: ShapeType;
        material: IMaterial;
        fake: string;
    }
}

declare module "cosmos/Primitive" {
    export interface IMaterial {
        name: string;
        id: number;
        friction: number;
        restitution: number;
    }

    export interface IQuaternion {
        x: number;
        y: number;
        z: number;
        w: number;
    }

    export interface IVector3 {
        x: number;
        y: number;
        z: number;
    }
}

declare module "cosmos/Body" {
    import { IVector3, IMaterial, IQuaternion } from "cosmos/Primitive";
    import {ShapeType} from "./statics";
    
    export interface IBody {
        id: number;
        shapeType: ShapeType | string;
        position?: IVector3 | undefined;
        velocity?: IVector3 | undefined;
        mass?: number | undefined;
        material?: IMaterial | undefined;
        quaternion?: IQuaternion | undefined;
    }
}

declare module "cosmos/World" {
    import { IBody } from "cosmos/Body";
    export interface IWorld {
        bodies: IBody[] | undefined;
    }
}

declare module "cosmos-inf" {
    export * from "cosmos/Shape";
    export * from "cosmos/Primitive";
    export * from "cosmos/Body";
    export * from "cosmos/World";
}
