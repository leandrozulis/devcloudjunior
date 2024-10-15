import express from 'express';
import aws from 'aws-sdk';
import { MicroServiceConsulta } from './infra/controllers/micro-service-consulta';

export const app = express();

aws.config.update({ region: 'sa-east-1' })
export const sqs = new aws.SQS();

const microServiceConsulta = new MicroServiceConsulta(sqs);
microServiceConsulta.microService();