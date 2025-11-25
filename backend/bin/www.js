import http from 'http';
import app from "../app.js";
import { connectDB } from "../models/index.js";   // <-- important

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) return val;
  if (port < 0) process.exit(1);
  return port;
};

const port = normalizePort(process.env.PORT || '5001');
app.set('port', port);
const server = http.createServer(app);

server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;
  console.error(error);
  process.exit(1);
});

server.on('listening', () => {
  console.log(`Server running → http://localhost:${port}`);
  console.log(`Swagger → http://localhost:${port}/api-docs`);
});


(async () => {
  await connectDB();       // <-- ensures DB connection
  server.listen(port);     // <-- start server only after DB OK
})();
