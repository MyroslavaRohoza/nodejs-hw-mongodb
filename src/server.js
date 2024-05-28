import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';

const PORT = Number(env('PORT', '3000'));

export function setupServer(){

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(
        pino({
          transport: {
            target: 'pino-pretty',
          },
        }),
      );

      app.get('/', (req, res) => {
        res.json({
          message: 'Hello World!',
        });
      });

      app.use('*', (req, res, next) => {
        res.status(404).json({
          message: 'Not found',
        });
      });

      app.use((err, req, res, next) => {
        res.status(500).json({
          message: 'Something went wrong',
          error: err.message,
        });
      });

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
}
