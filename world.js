const CANNON = require('cannon');

// Create a world
let world = new CANNON.World();
function initWorld() {
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;
    world.gravity.set(0, - 9.82, 0);  // Earth-like gravity
}

const defaultMaterial = new CANNON.Material('default');
function initMaterial() {
    world.defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction: 0.1,
            restitution: 0.7
        }
    );
}

// Floor
floorShape = new CANNON.Plane();
floorBody = new CANNON.Body();
function initFloor() {
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5);
    world.addBody(floorBody);
}


// Store bodies to manipulate them later
let bodies = [];

// Step the simulation
const stepWorld = (dt = 1 / 60) => {
    world.step(dt);
};

function init() {
    world = new CANNON.World();

    initWorld();
    initMaterial();
    initFloor();
}

function clear() {
    // TODO: this is not working
    world.bodies.forEach(body => world.remove(body));
    bodies = [];

    init();
}

init();

module.exports = { world, bodies, stepWorld, clear, CANNON };
