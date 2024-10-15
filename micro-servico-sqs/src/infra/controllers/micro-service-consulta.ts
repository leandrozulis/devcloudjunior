import { SQS } from 'aws-sdk';
import axios from 'axios';
import { env } from '../../env';

export class MicroServiceConsulta {
  private sqs: SQS;

  constructor(sqs: SQS) {
    this.sqs = sqs;
  }

  async microService() {
    const receiveMessage = () => {
      this.sqs.receiveMessage({
        MaxNumberOfMessages: 1,
        QueueUrl: env.QueueUrl,
        WaitTimeSeconds: 10
      })
      .promise()
      .then(dados => {
        if (!dados.Messages || dados.Messages.length === 0) {
          console.log('Nenhuma mensagem na fila');
          return Promise.resolve();
        } else if (dados.Messages && dados.Messages.length > 0) {
          const messageData = dados.Messages[0];

          if (messageData.Body) {
            const message = JSON.parse(messageData.Body).id;
            console.log('Mensagem recebida:', message);
          
            return axios.get(`http://localhost:3333/consultaCep/${message}`)
              .then(response => {
                if (response.status === 200) {
                  console.log('ID processado com sucesso:', message);
                  if (messageData.ReceiptHandle) {
                    return this.sqs.deleteMessage({
                      QueueUrl: env.QueueUrl,
                      ReceiptHandle: messageData.ReceiptHandle
                    }).promise().then(() => undefined);
                  }
                }
              }).catch(erro => {
                if (erro.response?.status === 404 || erro.response?.status === 400) {
                  console.log("Documento rejeitado, realizando a remoção da fila");
                  if (messageData.ReceiptHandle) {
                    return this.sqs.deleteMessage({
                      QueueUrl: env.QueueUrl,
                      ReceiptHandle: messageData.ReceiptHandle
                    }).promise().then(() => undefined);
                  }
                }
              });
          } else {
            console.log('Mensagem inválida: Body está vazio ou indefinido');
            return Promise.resolve();
          }
        }
      })
      .catch(err => {
        console.log("Erro durante o processamento:", err);
      })
      .finally(() => {
        receiveMessage();
      });
    };

    receiveMessage();
  }
}
