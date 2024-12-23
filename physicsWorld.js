const CANNON = require('cannon');

// Create a world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Earth-like gravity

// Add a ground plane
const groundBody = new CANNON.Body({
    mass: 0, // Mass of 0 makes it static
});
const groundShape = new CANNON.Plane();
groundBody.addShape(groundShape);
world.addBody(groundBody);

// Store bodies to manipulate them later
const bodies = [];

// Step the simulation
const stepWorld = (dt = 1 / 60) => {
    world.step(dt);
};

module.exports = { world, bodies, stepWorld, CANNON };
