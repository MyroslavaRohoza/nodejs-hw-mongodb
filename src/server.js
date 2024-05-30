import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';
import mongoose from 'mongoose';

const PORT = Number(env('PORT', '3000'));

export function setupServer() {
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
  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      message: 'Successfully found all contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      res.status(404).json({
        message: 'not found',
      });
      return;
    }
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        message: 'there is no contact with this id',
      });
    }
    res.status(200).json({
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use('*', (err, req, res) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
