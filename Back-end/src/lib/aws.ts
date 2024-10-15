import AWS from 'aws-sdk'
import { env } from '../env'

AWS.config.update({
  accessKeyId: env.accessKeyID,
  secretAccessKey: env.secretAccessKey,
  region: env.region
})

export const sqs = new AWS.SQS();