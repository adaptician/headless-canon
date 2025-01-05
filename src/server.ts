import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });
// REF for Docker deployment: https://github.com/motdotla/dotenv#options

console.log(`== ENV: ${process.env?.NODE_ENV ?? 'UNKNOWN'} ==`);

import app from './app';

const PORT = process.env?.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
