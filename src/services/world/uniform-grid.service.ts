
/*
* Uniform Grid: Divide the world into a fixed grid. 
* Simple but can be inefficient if objects are clustered in certain areas.
* */
import {IVector3} from "cosmos/Primitive";
import {IBody} from "cosmos/Body";

// TODO:T once you have something working, looks like Cannon has OctetTree - check it out.
export class UniformGridService {
    private readonly _cellSize: number = 50; // Size of each cell
    private readonly _worldSize: number = 500; // Size of the world
    private readonly _cellCount: number = Math.ceil(this._worldSize / this._cellSize);
    
    private _grid: Map<string, IBody[]> = new Map(); // Key: "x,y", Value: Array of objects in the cell

    getCellKey(position: IVector3): string {
        const x = Math.floor(position.x / this._cellSize);
        const y = Math.floor(position.y / this._cellSize);
        const z = Math.floor(position.z / this._cellSize);

        return `${x},${y},${z}`;
    }
    
    addBodyToGrid(body: IBody): void {
        if (!body?.position) 
            throw new Error('Unable to add a body to the grid without a position.');
        
        const key = this.getCellKey(body.position);
        
        const existing = this._grid.get(key) ?? [];
        existing.push(body);
        this._grid.set(key, existing);
    }
    
    // TODO:T fire from listeners:
    // world.addEventListener('beginContact', ...);
    // world.addEventListener('endContact', ...);`
    // body.addEventListener('collide', ...);
    // ALSO: https://github.com/schteppe/cannon.js/issues/351#issuecomment-343968143
    // Possibly useful: https://github.com/schteppe/cannon.js/issues/249#issuecomment-162441986
    updateBodyInGrid(body: IBody, previousPosition: IVector3): void {
        if (!body?.position)
            throw new Error('Unable to add a body to the grid without a position.');

        if (!previousPosition)
            throw new Error('Unable to update without a previous position - add instead.');

        const oldKey = this.getCellKey(previousPosition);
        const newKey = this.getCellKey(body.position);

        if (oldKey !== newKey) {
            // Remove from old cell
            if (this._grid.has(oldKey)) {
                const existingBodies = this._grid.get(oldKey) ?? [];
                this._grid.set(oldKey, existingBodies.filter(o => o !== body));
            }

            // Add to new cell
            this.addBodyToGrid(body);
        }
        
        // Body remains in the same cell - nothing to update.
    }
}