import {
    Body,
    ContactEquation,
    Vec3
} from 'cannon-es';
import {IContactEvent} from "../cosmos-cannon";

/*
* Uniform Grid: Divide the world into a fixed grid. 
* Simple but can be inefficient if objects are clustered in certain areas.
* */

// TODO:T once you have something working, looks like Cannon has OctetTree - check it out.
export class UniformGridService {
    private readonly _cellSize: number = 2; // Size of each cell
    private readonly _worldSize: number = 50; // Size of the world
    private readonly _cellCount: number = Math.ceil(this._worldSize / this._cellSize);
    
    private _grid: Map<string, Body[]> = new Map(); // Key: "x,y", Value: Array of objects in the cell

    getCellKey(position: Vec3): string {
        const x = Math.floor(position.x / this._cellSize);
        const y = Math.floor(position.y / this._cellSize);
        const z = Math.floor(position.z / this._cellSize);

        return `${x},${y},${z}`;
    }
    
    addBodyToGrid(body: Body): void {
        if (!body?.position) 
            throw new Error('Unable to add a body to the grid without a position.');
        
        const key = this.getCellKey(body.position);
        
        const existing = this._grid.get(key) ?? [];
        existing.push(body);
        this._grid.set(key, existing);
        
        console.log(`Added body ID ${body.id} to grid with KEY ${key}`);
    }
    
    updateBodyFromCollision(collision: IContactEvent): void {
        const { body, contact } = collision;
        console.log(`Collision updating body ID ${body.id} ...`);

        if (!body) {
            console.log('Unable to update the grid without a valid body.');
            return;
        }

        if (!body.position) {
            console.log('Unable to update a body to the grid without a position.');
            return;
        }

        if (!body.previousPosition) {
            console.log('Unable to update without a previous position.');
            return;
        }

        const oldKey = this.getCellKey(body.previousPosition);
        const newKey = this.getCellKey(body.position);

        if (oldKey !== newKey) {
            // Remove from old cell
            if (this._grid.has(oldKey)) {
                const existingBodies = this._grid.get(oldKey) ?? [];
                this._grid.set(oldKey, existingBodies.filter(o => o !== body));
            }

            // Add to new cell
            this.addBodyToGrid(body);
            console.log(`Updated body ID ${body.id} from KEY ${oldKey} to new KEY ${newKey}`);
            return;
        }

        // Body remains in the same cell - nothing to update.
        console.log(`NOTHING updated on body ID ${body.id} with position ${JSON.stringify(body.position)}`);
    }
    
    // TODO:T fire from listeners:
    // world.addEventListener('beginContact', ...);
    // world.addEventListener('endContact', ...);`
    // body.addEventListener('collide', ...);
    // ALSO: https://github.com/schteppe/cannon.js/issues/351#issuecomment-343968143
    // Possibly useful: https://github.com/schteppe/cannon.js/issues/249#issuecomment-162441986
    updateBodyInGrid(body: Body, previousPosition: Vec3): void {
        if (!body?.position) {
            console.log('Unable to update a body to the grid without a position.');
            return;
        }
            

        if (!previousPosition) {
            console.log('Unable to update without a previous position - add instead.');
            return;
        }            

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

        console.log(`Updated body ID ${body.id} from KEY ${oldKey} to new KEY ${newKey}`);
    }
}

