import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerAuth from './middleware/swaggerAuth.js';
import swaggerSpec from './config/swagger-config.js'
import apiRouter from './routes/routes.js'
import cors from 'cors'

import './config/index.js'  // only loads env variables, safe

const app = express();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ limit: '300mb', extended: true }));
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
