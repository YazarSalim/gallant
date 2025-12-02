import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerAuth from './middleware/swaggerAuth.js';
import swaggerSpec from './config/swagger-config.js'
import apiRouter from './routes/routes.js'
import cors from 'cors'
import path from "path"

import './config/index.js'  // only loads env variables, safe

const app = express();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ limit: '300mb', extended: true }));
const __dirname = path.resolve(); // ensures __dirname works in ESM

// Serve uploaded profile photos
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads/profile')));
app.use('/', express.static('public'));

app.use(
  '/api-docs',
  swaggerAuth,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true },
  }),
);

app.use('/api',apiRouter)

app.get('/', (req, res) => {
  res.send('Welcome');
});

export default app;
