import api from "./api";

export function mapAcolhidoToResident(acolhido: any) {
  return {
    status: acolhido.status,
    usuarioNome: acolhido.nome,
    usuarioNomeSocial: acolhido.nomeSocial,
    usuarioCPF: acolhido.cpf,
    usuarioRG: acolhido.rg,
    usuarioTelefone: acolhido.telefone,
    usuarioEndereco: acolhido.endereco,
    usuarioNumero: acolhido.numero,
    usuarioBairro: acolhido.bairro,
    usuarioEstadoCivil: acolhido.estadoCivil,
    usuarioNaturalidade: acolhido.naturalidade,
    usuarioDataNascimento: acolhido.dataNascimento,
    usuarioSexoBiologico: acolhido.sexo,
    progressoPorcentagem: acolhido.progresso
  };
}

class ResidentService {
  async listar() {
    return api.get("/residents");
  }

  async cadastrar(data: any) {
    return api.post("/residents", data);
  }

  async atualizar(id: string, data: any) {
    return api.put(`/residents/${id}`, data);
  }

  async excluir(id: string) {
    return api.delete(`/residents/${id}`);
  }
}

export default new ResidentService();
