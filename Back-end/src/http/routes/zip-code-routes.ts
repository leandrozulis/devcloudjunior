import express from "express";
import { ZipCodeController } from "../controllers/zip-code-controller";

export const routesZipCode = express.Router();

/**
 * @swagger
 * /cep:
 *   post:
 *     summary: Cria um novo CEP
 *     description: Recebe um CEP no corpo da requisição e cria um novo registro com o status inicial.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cep:
 *                 type: string
 *                 description: O CEP a ser cadastrado.
 *                 example: "87020025"
 *     responses:
 *       201:
 *         description: CEP criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cep:
 *                   type: string
 *                   description: O CEP criado.
 *                   example: "87020025"
 *                 status:
 *                   type: string
 *                   description: Status do CEP.
 *                   example: "PENDENTE"
 *                 id:
 *                   type: string
 *                   description: ID gerado para o registro.
 *                   example: "670ab25ff79d9f872dbd11d4"
 *       500:
 *         description: Ocorreu um erro interno no Servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *                  example: "Ocorreu um erro interno no servidor"
 */
routesZipCode.post("/cep", ZipCodeController.createZipCode);

/**
 * @swagger
 * /consultaCep/{id}:
 *   get:
 *     summary: Consulta o CEP pelo ID
 *     description: Recebe um ID, consulta no banco de dados e retorna o CEP, status e demais dados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do registro a ser consultado.
 *         example: "670ab25ff79d9f872dbd11d4"
 *     responses:
 *       200:
 *         description: Dados do CEP encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cep:
 *                   type: string
 *                   description: O CEP encontrado.
 *                   example: "87020025"
 *                 status:
 *                   type: string
 *                   description: Status do CEP.
 *                   example: "CONCLUIDO"
 *                 data:
 *                   type: object
 *                   description: Outros dados relacionados ao CEP.
 *                   properties:
 *                     cep:
 *                       type: string
 *                       example: "87020-025"
 *                     logradouro:
 *                       type: string
 *                       example: "Avenida Duque de Caxias"
 *                     complemento:
 *                       type: string
 *                       example: "de 701/702 ao fim"
 *                     bairro:
 *                       type: string
 *                       example: "Zona 07"
 *                     localidade:
 *                       type: string
 *                       example: "Maringá"
 *                     uf:
 *                       type: string
 *                       example: "PR"
 *                     unidade:
 *                       type: string
 *                       example: ""
 *                     ibge:
 *                       type: string
 *                       example: "4115200"
 *                     gia:
 *                       type: string
 *                       example: ""
 *       404:
 *         description: O CEP não foi encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *                  example: "CEP not found"
 *       500:
 *         description: Ocorreu um erro interno no Servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *                  example: "Ocorreu um erro interno no servidor"
 */
routesZipCode.get("/consultaCep/:id", ZipCodeController.getByIdAndCep);

/**
 * @swagger
 * /consulta/{id}:
 *   get:
 *     summary: Consulta os dados pelo ID
 *     description: Recebe um ID na URL e retorna os dados do banco de dados associados a esse ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do registro a ser consultado.
 *         example: "670ab25ff79d9f872dbd11d4"
 *     responses:
 *       200:
 *         description: Dados encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 retCep:
 *                   type: object
 *                   description: Dados relacionados ao CEP.
 *                   properties:
 *                     cep:
 *                       type: string
 *                       example: "87020-025"
 *                     logradouro:
 *                       type: string
 *                       example: "Avenida Duque de Caxias"
 *                     complemento:
 *                       type: string
 *                       example: "de 701/702 ao fim"
 *                     unidade:
 *                       type: string
 *                       example: ""
 *                     bairro:
 *                       type: string
 *                       example: "Zona 07"
 *                     localidade:
 *                       type: string
 *                       example: "Maringá"
 *                     uf:
 *                       type: string
 *                       example: "PR"
 *                     ibge:
 *                       type: string
 *                       example: "4115200"
 *                     gia:
 *                       type: string
 *                       example: ""
 *       404:
 *         description: ID does not exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *                  example: "CEP not found"
 *       500:
 *         description: Ocorreu um erro interno no Servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *                  example: "Ocorreu um erro interno no servidor"
 */
routesZipCode.get("/consulta/:id", ZipCodeController.getById);