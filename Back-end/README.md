## Desenvolver uma aplicação em NodeJS no modelo de arquitetura produtor x consumidor utilizando o SQS como mensageria.

# O produtor no contexto do modelo arquitetural será uma API REST que fará o papel de:

[x] - Recepcionar o número de um CEP no body da requisição;
[x] - Persistir a informação em uma collection no MongoDB, com status PENDENTE e;
[x] - Inserir uma mensagem na fila, que deverá ser criada no SQS, indicando o ID do registro criado no Mongo.

# O consumidor no contexto do modelo arquitetural será uma aplicação que permanecerá em execução, lendo as mensagens da fila até que encontre uma mensagem, uma vez encontrada a mensagem o consumidor deverá:

[x] - Encontrar o registro criado no banco de dados;
[x] - Consultar o CEP utilizando o https://viacep.com.br/ws/:cepNumber/json/
[x] - Atualizar o registro da collection, incluindo o resultado da consulta em um nó data.
[x] - Ao final da execução o consumidor deverá:
[x] - Alterar status do registro para CONCLUIDO, em caso de sucesso;
[x] - Alterar status do registro para REJEITADO, em caso de falha.
[x] - Remover a mensagem da fila;
[x] - Permanecer em loop esperando por novas mensagens.

# Exemplo de conteúdo recebido pela API no body da requisição

{
"cep": "87020025"
}

# Exemplo de registro que deve ser persistido:

{
"cep": "87020025",
"status": "PENDENTE"
}

# Resultado esperado após o processamento do consumidor:

{
"cep": "87020025",
"status": "CONCLUIDO",
"data": {
"cep": "87020-025",
"logradouro": "Avenida Duque de Caxias",
"complemento": "de 701/702 ao fim",
"bairro": "Zona 07",
"localidade": "Maringá",
"uf": "PR",
"unidade": "",
"ibge": "4115200",
"gia": ""
}
}
