const express = require('express');
const bodyParser = require('body-parser');
const { world, bodies, stepWorld, CANNON } = require('./physicsWorld');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// API to add a new body to the world
app.post('/addBody', (req, res) => {
    const { shape, mass, position } = req.body;

    let body;
    switch (shape) {
        case 'box':
            body = new CANNON.Body({ mass });
            body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));
            break;
        case 'sphere':
            body = new CANNON.Body({ mass });
            body.addShape(new CANNON.Sphere(1));
            break;
        default:
            return res.status(400).send('Unsupported shape type');
    }

    // Set the initial position
    if (position) {
        body.position.set(position.x, position.y, position.z);
    }

    // Add the body to the world
    world.addBody(body);
    bodies.push(body);

    res.send({ message: 'Body added', bodyId: bodies.length - 1 });
});

// API to apply force to a body
app.post('/applyForce', (req, res) => {
    const { bodyId, force, point } = req.body;

    if (!bodies[bodyId]) {
        return res.status(404).send('Body not found');
    }

    const body = bodies[bodyId];
    const forceVec = new CANNON.Vec3(force.x, force.y, force.z);
    const pointVec = new CANNON.Vec3(point.x, point.y, point.z);

    body.applyForce(forceVec, pointVec);
    res.send({ message: 'Force applied' });
});

// API to step the simulation
app.post('/step', (req, res) => {
    const { dt } = req.body;
    stepWorld(dt);
    res.send({ message: 'World stepped', bodies: bodies.map(body => body.position) });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
