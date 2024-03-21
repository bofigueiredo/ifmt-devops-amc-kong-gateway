import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { iaData } from "./database/ia";
import { devopsData } from "./database/devops";


const app = express();
const port = 9090;


const kcConfig = {
  clientId: "simple-node-client",
  bearerOnly: true,
  serverUrl: "http://192.168.15.23:8081",
  realm: "master",
  realmPublicKey:
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz/TlanmGznylX+gr0H7StrUaq60pVjQ0nP6p9Cc7CBxZ9HKu+B0Kt05w2cSe5g8E+T/BMfve9pOO/Zucmd6DbrjtePpzmqNUStk42Z+JGTCOMl7MMGlK6ElFPzL5Ze2sHc08swNQV105gDAzOlnR0mEJQk9uWpx/qZ6uAhDEZcwmwGfOAUUHCw/oLwj5/xFQGN7tx6bd9vfOo2S2aipK8qZlwLfkMmccj0BYs47VY7jopNs1c1ee6hI89pcMi7EcHKMhQnqtm1Gmy0T0cV30yQsgF7rcuUvRbno24/HUzssnrtizN7zvKe4KvEz/3Tc0dB1LA73IxZPBlhfFnYkEeQIDAQAB",
};

const session = require('express-session');
const Keycloak = require('keycloak-connect');
const keycloak = new Keycloak({ store: new session.MemoryStore() }, kcConfig);

app.use(
  cors({
    origin: true,
  }),
  bodyParser.json(),  
//  keycloak.middleware(),
//  keycloak.protect()
);


interface Theme { id: number; tema: string; }
const iaList: Theme[] = iaData;
const devopsList: Theme[] = devopsData;

let count = 0;

app.get("/ia", (req: Request, res: Response) => {
//app.get("/ia", keycloak.protect('realm:ia-list'), (req: Request, res: Response) => {
  count++
  console.log(`REQUEST GET /IA - Count:${count}`);
  res.json(iaList);
});

app.get("/ia/:id", keycloak.protect('realm:ia-list'), (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const ia = iaList.find((m) => m.id === id);
  if (ia) {
    res.json(ia);
  } else {
    res.status(404).json({ error: "404 - Not Found!" });
  }
});

app.get("/devops", keycloak.protect('realm:role_devops'), (req: Request, res: Response) => {
  res.json(devopsList);
});

app.get("/devops/:id", keycloak.protect('realm:role_devops'), (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const devops = devopsList.find((m) => m.id === id);
  if (devops) {
    res.json(devops);
  } else {
    res.status(404).json({ error: "404 - Not Found!" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
