import {
    Body, Quaternion, Vec3
} from 'cannon-es';

export class TrackingBody {
    
    // For some reason extending Body breaks the object hierarchy.
    body: Body;
    
    constructor(body: Body) {
        
        this.body = body;
    }
    
    /*
    * This is a workaround to overcome that only a collision event listener is available on body objects.
    * We still have to continuously loop through the entire list of bodies,
    * but we check if something has changed prior to broadcasting.
    * This demonstrates the advantage of the event-driven approach. 
    * We only need to process an update for an object if something has changed. 
    * */
    hasDelta(): boolean {

        // Check position delta
        if (!this.body.position.almostEquals(this.body.previousPosition)) {
            return true;
        }

        // Check rotation delta
        if (this.body.quaternion == this.body.previousQuaternion) {
            return true;
        }

        // Check if the body is moving (has non-zero velocity)
        if (this.body.velocity.length() > 0) {
            return true;
        }

        console.log(`NO CHANGE!`);
        // No change detected
        return false;
        
    }
    
}