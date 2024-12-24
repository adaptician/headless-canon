declare namespace COSMOS {

  export interface IBody {
    id: number;
    position?: IVector3 | undefined;
    velocity?: IVector3 | undefined;
    mass?: number | undefined;
    material?: IMaterial | undefined;
    quaternion?: IQuaternion | undefined;
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
    // The fixed time step size to use.
    delta: number;

    bodies: IBody[] | undefined;
  }
}

declare module "cosmos" {
  export = COSMOS;
}
