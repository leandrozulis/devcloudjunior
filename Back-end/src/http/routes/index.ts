import express from 'express';
import { routesZipCode } from './zip-code-routes';

export const routesApp = (app) => {  
  app.use(express.json(), routesZipCode);
};