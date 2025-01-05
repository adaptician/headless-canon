import {ShapeType} from "./statics";

export namespace COSMOS {

    export interface IShape {
        id: number;
        colorHexCode?: number | undefined;
    }

    export interface IPlaneShape extends IShape {
        width: number;
        height: number;
    }

    export interface IBoxShape extends IShape {
        width: number;
        height: number;
        depth: number;
    }

    export interface ISphereShape extends IShape {
        radius: number;
    }

    export interface IBuildBody {
        worldId: string;
        shapeType: ShapeType | string;
        position?: IVector3 | undefined;
        mass?: number | undefined;
        material?: IMaterial | undefined;
        quaternion?: IQuaternion | undefined;
        shapeOptions?: IPlaneShape | IBoxShape | ISphereShape;
    }

    export interface IBody {
        id: number;
        shapeType: ShapeType | string;
        shapeOptions?: IPlaneShape | IBoxShape | ISphereShape;
        position?: IVector3 | undefined;
        velocity?: IVector3 | undefined;
        mass?: number | undefined;
        material?: IMaterial | undefined;
        quaternion?: IQuaternion | undefined;
        scale?: IVector3 | undefined;
    }

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

    export interface IWorld {
        bodies: IBody[] | undefined;
    }
}
