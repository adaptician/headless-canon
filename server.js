const express = require('express');
const bodyParser = require('body-parser');
const { world, bodies, stepWorld, CANNON } = require('./world');
const {join} = require("node:path");
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(cors());

// API to retrieve the world state.
app.get('/world', (req, res) => {    
    const _bodies = bodies.map(body => ({
        id: body.id, // Add a unique ID to each body
        position: body.position,
        quaternion: body.quaternion // For rotation
    }));

    res.json({ 
        bodies: _bodies
    });
});

// API to add a new body to the world
app.post('/addBody', (req, res) => {
    const { shape, mass, position, quaternion } = req.body;

    let body;
    // TODO:T introduce prototype pattern here.
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
        body.position.copy(position);
    }
    
    if (quaternion) {
        body.quaternion.copy(quaternion);
    }
    
    body.material = new CANNON.Material('default');

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

// Serve Angular app
const clientPath = join(__dirname, 'client', 'dist', 'client');
app.use(express.static(clientPath));

// Handle all other requests with Angular's index.html
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'client', 'dist', 'client', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// This setup serves your Angular app from the client/dist/client directory after building it for production.

// Create a proxy.conf.json file in the client directory to forward API requests to the Node.js
