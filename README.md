# headless-canon

## Run the server
`node server.js`

## Test the API

```
curl -X POST http://localhost:3000/addBody \
-H "Content-Type: application/json" \
-d '{"shape": "sphere", "mass": 5, "position": {"x": 0, "y": 10, "z": 0}}'
```

```
curl -X POST http://localhost:3000/applyForce \
-H "Content-Type: application/json" \
-d '{"bodyId": 0, "force": {"x": 0, "y": 0, "z": 10}, "point": {"x": 0, "y": 10, "z": 0}}'
```

```
curl -X POST http://localhost:3000/step \
-H "Content-Type: application/json" \
-d '{"dt": 0.016}'
```

## Deploy to Docker
 
`npm run build` to create dist folder

`docker build -t canonjs-with-client .`

`docker run -p 3000:3000 canonjs-with-client`