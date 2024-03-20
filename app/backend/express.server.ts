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
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjHA3ZP9Kp9HAMGzHex/Htl85AAkLWu7X1yR2lfvT/hEoMsgBlwufUNAsrzVgfoXbolqntZluLeVmie0TZTY0goeU9Fr1Xo7vGebnRwecC8XSS23n+cGweUGT7OstBIh4kN7zAS/O02jG2i9fC92bqh4rtGw0oe2T1iyZU24N4SgUu6VUVBHBvM204P3QDHwuqvW4/RtQo7LY4Dw+UipzaGhVRszAwABny2OICvIX3QYvtaXsxgEXSThRiwQLQyyGy03vwYbvcOCM73AvMSoAHkyz3DdvkkugZPfv9sbaXs/ZbjR1+Wq8FnVO9roBwbMB4eqRUA+BNfHesRZw4CjiqQIDAQAB",
};

const session = require('express-session');
const Keycloak = require('keycloak-connect');
const keycloak = new Keycloak({ store: new session.MemoryStore() }, kcConfig);

app.use(
  cors({
    origin: true,
  }),
  bodyParser.json(),  
  keycloak.middleware(),
  keycloak.protect()
);


interface Theme { id: number; tema: string; }
const iaList: Theme[] = iaData;
const devopsList: Theme[] = devopsData;

app.get("/ia", keycloak.protect('realm:ia-list'), (req: Request, res: Response) => {
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
