# headless-canon

# run the server
`node server.js`

# test the API

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