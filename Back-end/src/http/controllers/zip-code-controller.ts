import axios from "axios";
import { zipCode } from "../models/zip-code-models";
import { AwsController } from "./aws-controller";
import { ZipCodeDto } from "./dto/zip-code-dto";

export class ZipCodeController {
  static async createZipCode(req, res) {
    const { cep } = req.body;

    const zipCodeDTO: ZipCodeDto = {
      cep
    };

    try {
      const { cep, status, _id } = await zipCode.create(zipCodeDTO)
      
      AwsController.sendToQueue(_id)
      
      res.status(201).json({
        cep, status, id: _id
      })
    } catch (error) {
      if (error instanceof Error) {
        res
        .status(500)
        .json({ message: `${error.message} - Ocorreu um erro interno no servidor` });
      }
    }
  }

  static async getByIdAndCep(req, res) {
    const { id } = req.params;

    try {
      const retornoCep = await zipCode.findById(id);
      if (!retornoCep) {
        return res.status(404).json({ message: "ID not found" });
      }

      const cepNumber = retornoCep.cep;

      try {
        const buscacep = await axios.get(`https://viacep.com.br/ws/${cepNumber}/json/`);

        if (buscacep.data.erro) {
          await ZipCodeController.updateZipCodeStatus(id, {
            status: 'REJEITADO',
            data: null
          });
          return res.status(404).json({ message: "CEP not found" });
        }

        const retUpdate = await ZipCodeController.updateZipCodeStatus(id, {
          status: 'CONCLUIDO',
          data: buscacep.data
        });

        if (!retUpdate) {
          return res.status(404).json({ message: "The zip code cannot be updated" });
        }

        return res.status(200).json({
          cep: retUpdate.cep,
          status: retUpdate.status,
          data: retUpdate.data
        });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          await ZipCodeController.updateZipCodeStatus(id, {
            status: 'REJEITADO',
            data: null
          });
          return res.status(400).json({ message: "Bad Request - Invalid URL" });
        }
          
        return res.status(500).json({ message: "Error processing the request", error: error.message });
      }

    } catch (err) {
      return res.status(400).json({ message: "Error processing the request", error: err.message });
    }
  }

  static async updateZipCodeStatus(id: string, updateData: object) {
    try {
      const updatedDocument = await zipCode.findByIdAndUpdate(id, updateData, { new: true });
      return updatedDocument;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error('Erro ao atualizar o banco de dados');
      }
    }
  }

  static async getById(req, res) {
    const id = req.params.id;
    
    try {
      const retornoCep = await zipCode.findById(id)

      if (retornoCep === null) {
        return res.status(404).json({ message: 'ID does not exists'})
      }

      return res.status(200).json({
        retCep: retornoCep.data
      })
    } catch (err) {
      return res.status(500).json({ message: 'Ocorreu um erro interno no servidor'})
    }
  }
}