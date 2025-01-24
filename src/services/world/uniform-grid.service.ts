import {
    Body,
    Vec3
} from 'cannon-es';
import {getStreamableBody, IContactEvent} from "../cosmos-cannon";
import {EventBusService} from "../event-bus/event-bus.service";
import {TrackingBody} from "../../cosmos/tracking-body";

/*
* Uniform Grid: Divide the world into a fixed grid. 
* Simple but can be inefficient if objects are clustered in certain areas.
* */

/*
* TODO:T thinking
*  Given that updates will only be pushed according to area of interest, the manager for the partitioned world should
* do the publishing to the bus.
* Bearing in mind that we will create a separate service for communication with the bus, which other services can use,
* but ANY change to position etc SHOULD run through here. IRRESPECTIVE of whether it's location in the grid changes,
* we publish that something happened. If the object moved or stayed, users interested in this area will hear about it.
* 
* Prompted by a collision this would then cover changes in position and rotation caused by a collision.
* 
* Prompted by ray tracing? Ray tracing is a rendered concern, to decide if an object is "hit" by input.
* The action resulting from that input needs to be sent through the event API.
* If it's a collision, it will trigger as above.
* If it's something else, like a change to colour / texture or some other property, that needs to be managed by something
* else, or included in the physics engine, depending on if it's a concern of physics. We don't need to worry about this
* just now.
* 
* For simplicity, we are going to focus on collisions only, even once we start dealing with user input.
* */

export class UniformGridService {
    private readonly _cellSize: number = 2; // Size of each cell
    private readonly _worldSize: number = 50; // Size of the world
    private readonly _cellCount: number = Math.ceil(this._worldSize / this._cellSize);
    
    private _grid: Map<string, TrackingBody[]> = new Map(); // Key: "x,y", Value: Array of objects in the cell
    
    constructor(private _eventBusService: EventBusService) {
    }
    
    getCellKey(position: Vec3): string {
        const x = Math.floor(position.x / this._cellSize);
        const y = Math.floor(position.y / this._cellSize);
        const z = Math.floor(position.z / this._cellSize);

        return `${x},${y},${z}`;
    }
    
    addBodyToGrid(worldId: string, body: Body): void {
        if (!body?.position) 
            throw new Error('Unable to add a body to the grid without a position.');
        
        const key = this.getCellKey(body.position);
        
        const existing = this._grid.get(key) ?? [];
        
        existing.push(new TrackingBody(body));
        this._grid.set(key, existing);
        
        // console.log(`Added body ID ${body.id} to grid with KEY ${key}`);

        const streamableBody = getStreamableBody(body);
        if (streamableBody) {
            this._eventBusService.publish(
                // TODO:T you need to create a routing key builder for easier re-use
                `world.${worldId}.unit.${key}.physics.addBody`
                , JSON.stringify(streamableBody));
        }
    }
    
    updateBodyFromCollision(worldId: string, collision: IContactEvent): void {
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
                this._grid.set(oldKey, existingBodies.filter(o => o.body !== body));
            }

            // Add to new cell
            this.addBodyToGrid(worldId, body);
            // console.log(`Updated body ID ${body.id} from KEY ${oldKey} to new KEY ${newKey}`);
            return;
        }

        // Body remains in the same cell - nothing to update in the grid.
        // console.log(`NOTHING updated on body ID ${body.id} with position ${JSON.stringify(body.position)}`);

        // Nonetheless, other properties may have been affected; 
        // therefore, in all cases, we notify observers of a collision.
        const streamableBody = getStreamableBody(body);        
        if (streamableBody) {
            this._eventBusService.publish(
                // TODO:T you need to create a routing key builder for easier re-use
                `world.${worldId}.unit.${newKey}.physics.collision`
                , JSON.stringify(streamableBody));
        }

        // Ref: https://www.cloudamqp.com/blog/part4-rabbitmq-for-beginners-exchanges-routing-keys-bindings.html
        
        // TO WORLD exchange
        // TEMPLATE world.{worldId}.unit.{aoiKey}.{eventCategory}.{eventType}
        //                    ^ session key
        // EXAMPLES
        //          world.simulator-x23.unit.3,2,0.physics.collision
        //          world.simulator-x23.unit.1,1,0.physics.transform // perhaps as a result of user or system input
        // Why would we care? Perhaps we want a particular alert if something enters our AoI - granular events give us more control.
        //          world.simulator-x23.unit.5,0,1.physics.scale // perhaps as a result of user or system input
        // Why would we care? Perhaps to auto- or prompt a perspective change - zoom out to see the large object.
        //          world.simulator-x23.unit.3,3,0.render.color
        // Why would we care? Perhaps the user is color-blind, or prefer a dark-theme. They can ignore these, or intercept them.
        //          world.simulator-x23.unit.3,3,0.render.material
        // Why would we care? Trigger retrieval of texture from cache - AVOID sending large payloads via the bus itself.
        //          world.simulator-x23.unit.2,2,0.player.enter
        // Why would we care? Perhaps we want to welcome them with fanfare.
        //          world.simulator-x23.unit.2,2,0.player.exit
        // Why would we care? Perhaps they had duties, which must now be taken up by those remaining.
        // We broadcast interest in world, unit, category, and type
        // For a clients we expect topic separation to focus on the end words, as per AoI, category and type.
        // 
        
        // Routing Keys:
        // Delimiter: .
        // * = wildcard (placeholder for anything)
        // # = match zero or more words
    }
    
    /*
    * Unfortunately this seems to be required with CannonJS;
    * If the engine provides us a way to hook events in a granular manner, we could avoid this.
    * */
    stepGridUpdate(worldId: string): void {
        this._grid.forEach((bodies, key) => {
            bodies.forEach(body => {
                
                if (body.hasDelta()) {
                    
                    const streamableBody = getStreamableBody(body.body);
                    if (streamableBody) {
                        this._eventBusService.publish(
                            // TODO:T you need to create a routing key builder for easier re-use
                            `world.${worldId}.unit.${key}.physics.step`
                            , JSON.stringify(streamableBody));
                    }
                }
                
            });
        });
    }
    
    clearGrid(): void {
        this._grid = new Map();
    }
}

