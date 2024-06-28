import express, { Request, Response } from 'express';
import session from 'express-session';
import next from 'next';

declare module 'express-session' {
  interface SessionData {
    exampleKey: string;
  }
}

const dev: boolean = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: 'lax' }
  }));

  server.get('/set-session', (req: Request, res: Response) => {
    if (req.session) {
      req.session.exampleKey = 'exampleValue';
      res.send('Session set');
    } else {
      res.status(500).send('Session is not initialized');
    }
  });

  server.get('/get-session', (req: Request, res: Response) => {
    if (req.session) {
      const value = req.session.exampleKey;
      res.send(`Session value: ${value}`);
    } else {
      res.status(500).send('Session is not initialized');
    }
  });

  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(3000, (err?: any) => {
    if (err) throw err;
    console.log('Server running on http://localhost:3000');
  });
});



// "dev": "ts-node server.ts",
    // "build": "next build",
    // "start": "NODE_ENV=production ts-node server.ts"