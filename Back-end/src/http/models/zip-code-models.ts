import mongoose from "mongoose";

const ZipCodeSchema = new mongoose.Schema({
  cep: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDENTE', 'CONCLUIDO', 'REJEITADO'], 
    default: 'PENDENTE' 
  },
  data: {
    cep: String,
    logradouro: String,
    complemento: String,
    bairro: String,
    localidade: String,
    uf: String,
    unidade: String,
    ibge: String,
    gia: String
  }
}, {
  timestamps: true
});

export const zipCode = mongoose.model("tspdcep", ZipCodeSchema);