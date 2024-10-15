import axios from 'axios'
import { zipCode } from '../../models/zip-code-models';
import { AwsController } from '../aws-controller';
import { ZipCodeController } from '../zip-code-controller';

jest.mock('../../models/zip-code-models');
jest.mock('../aws-controller');
jest.mock('axios');

describe('ZipCodeController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createZipCode', () => {
    it('deve criar um novo zipCode e enviar para a fila da AWS', async () => {
      const req = { body: { cep: '12345678' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const createdZipCode = { cep: '12345678', status: 'PENDENTE', _id: '123' };

      (zipCode.create as jest.Mock).mockResolvedValue(createdZipCode);

      (AwsController.sendToQueue as jest.Mock).mockResolvedValue(null);

      await ZipCodeController.createZipCode(req, res);

      expect(zipCode.create).toHaveBeenCalledWith({ cep: '12345678' });
      expect(AwsController.sendToQueue).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        cep: '12345678',
        status: 'PENDENTE',
        id: '123',
      });
    });

    it('deve retornar erro 500 se houver falha ao criar o zipCode', async () => {
      const req = { body: { cep: '12345678' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (zipCode.create as jest.Mock).mockRejectedValue(new Error('Erro ao criar'));

      await ZipCodeController.createZipCode(req, res);

      expect(zipCode.create).toHaveBeenCalledWith({ cep: '12345678' });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro ao criar - Ocorreu um erro interno no servidor',
      });
    });
  });

  describe('getByIdAndCep', () => {
    it('deve retornar dados do CEP após consulta na API ViaCEP e atualizar o status', async () => {
      const req = { params: { id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const retornoCep = { cep: '12345678', status: 'PENDENTE' };
      const apiResponse = { data: { cep: '12345678', logradouro: 'Rua Teste' } };

      // Simular busca no banco de dados
      (zipCode.findById as jest.Mock).mockResolvedValue(retornoCep);

      // Simular chamada à API ViaCEP
      (axios.get as jest.Mock).mockResolvedValue(apiResponse);

      // Simular atualização no banco de dados
      (zipCode.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        cep: '12345678',
        status: 'CONCLUIDO',
        data: apiResponse.data,
      });

      await ZipCodeController.getByIdAndCep(req, res);

      expect(zipCode.findById).toHaveBeenCalledWith('123');
      expect(axios.get).toHaveBeenCalledWith('https://viacep.com.br/ws/12345678/json/');
      expect(zipCode.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { status: 'CONCLUIDO', data: apiResponse.data },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        cep: '12345678',
        status: 'CONCLUIDO',
        data: apiResponse.data,
      });
    });

    it('deve retornar erro 404 se o CEP não for encontrado na API ViaCEP', async () => {
      const req = { params: { id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const retornoCep = { cep: '12345678', status: 'PENDENTE' };
      const apiResponse = { data: { erro: true } };

      // Simular busca no banco de dados
      (zipCode.findById as jest.Mock).mockResolvedValue(retornoCep);

      // Simular chamada à API ViaCEP
      (axios.get as jest.Mock).mockResolvedValue(apiResponse);

      await ZipCodeController.getByIdAndCep(req, res);

      expect(zipCode.findById).toHaveBeenCalledWith('123');
      expect(axios.get).toHaveBeenCalledWith('https://viacep.com.br/ws/12345678/json/');
      expect(zipCode.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { status: 'REJEITADO', data: null },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'CEP not found' });
    });
  });

  describe('getById', () => {
    it('deve retornar os dados do CEP se encontrado', async () => {
      const req = { params: { id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const retornoCep = { data: { cep: '12345678', logradouro: 'Rua Teste' } };

      (zipCode.findById as jest.Mock).mockResolvedValue(retornoCep);

      await ZipCodeController.getById(req, res);

      expect(zipCode.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ retCep: retornoCep.data });
    });

    it('deve retornar erro 404 se o ID não for encontrado', async () => {
      const req = { params: { id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      (zipCode.findById as jest.Mock).mockResolvedValue(null);

      await ZipCodeController.getById(req, res);

      expect(zipCode.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'ID does not exists' });
    });
  });
});
