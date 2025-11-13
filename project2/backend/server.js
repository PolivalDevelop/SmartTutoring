
import express, { json, urlencoded, static as serveStatic } from 'express';
import { join } from 'path';
import { connect } from 'mongoose';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import expressOpenAPI from 'express-openapi-generator';
import { writeFileSync } from 'fs';
import { hash } from '@node-rs/argon2';
import Admin from './models/adminModel.js';
import idProjection from './controller/idProjection.js';
import { createSocketIoServer } from './controller/chat/index.js'


const documentBuilder = expressOpenAPI.DocumentBuilder.initializeDocument({
  openapi: '3.0.1',
  info: {
    title: 'Smart Tutoring backend',
    version: '1',
  },
  paths: {}, // You don't need to include any path objects, those will be generated later
});
const __dirname = import.meta.dirname;

// Inizializziamo l'applicazione Express
const app = express();

// Configuriamo i middleware
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(serveStatic('uploads'));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use(serveStatic(join(__dirname, '../frontend/dist')));

//Route per servire index.html quando si accede a "/"
app.get('/', function (req, res) {
  res.sendFile(join(__dirname, '../frontend/dist', 'index.html'));
});

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tutoring';
// Connessione al database
connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection to database successful');
    // Crea admin di default se non esiste
    createDefaultAdmin();
  })
  .catch((error) => {
    console.error('Errore connecting to the database:', error.message);
  });


// Funzione per creare l'admin di default
async function createDefaultAdmin() {
  try {
    const admins = await Admin.find({}, idProjection(Admin), null).exec();
    if (admins.length === 0) {
      const admin = new Admin({
        username: 'admin',
        password: await hash('admin'),
        firstName: 'admin',
        lastName: 'admin',
        hasFullPrivileges: true,
      });
      await Admin.create(admin, null);
      console.log('Admin di default creato con successo.');
    } else {
      console.log('Admin di default già esistente.');
    }
  } catch (error) {
    console.error('Errore nella creazione dell\'admin di default:', error);
  }
}  


import admins from './routes/adminRouter.js';
import lessons from './routes/lessonRouter.js';
import reports from './routes/reportRouter.js';
import reviews from './routes/reviewRouter.js';
import users from './routes/userRouter.js';

// Configuriamo i percorsi
// ad esempio app.use('/trainers', trainersRouter);
//indica che tutte le route definite nel modulo trainersRouter
//saranno raggiungibili attraverso l'URL base /trainers.
app.use('/api/admins', admins);
app.use('/api/lessons', lessons);
app.use('/api/reports', reports);
app.use('/api/reviews', reviews);
app.use('/api/users', users);

// Avviamo il server su una porta specifica
//  Il server Express viene avviato su una porta specifica,
//  che è definita come variabile di ambiente process.env.PORT o come porta predefinita 3000.
const port = process.env.PORT || 4000;
if (process.env.GENERATE_OPENAPI !== undefined) {
  documentBuilder.generatePathsObject(app);
  writeFileSync("openapi.json", JSON.stringify(documentBuilder.build()));
} else {
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  app.locals.io = createSocketIoServer(server);
}