import { sqs } from "../../lib/aws"
import { env } from "../../env";

export class AwsController {
  static sendToQueue(_id: object) {
    sqs.sendMessage(
      {
        MessageBody: JSON.stringify({ id: _id }),
        QueueUrl: env.QueueUrl
      }, (erro, data) => {
        if (erro) {
          console.log("Erro", erro);
        } else {
          console.log("Sucesso!", data.MessageId);
        }
    })
  }
}