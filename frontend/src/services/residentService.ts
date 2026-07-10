import api from "./api";
import { Acolhido } from "../types";

// Envia o objeto Acolhido praticamente como está: o backend já separa
// automaticamente os campos escalares (colunas reais) do restante
// (guardado em JSON), então não precisamos mais mapear campo a campo aqui.
export function mapAcolhidoToResident(acolhido: Acolhido) {
  return { ...acolhido };
}

class ResidentService {
  async listar(): Promise<Acolhido[]> {
    return api.get("/residents");
  }

  async cadastrar(data: Partial<Acolhido>): Promise<Acolhido> {
    return api.post("/residents", data);
  }

  async atualizar(id: string, data: Partial<Acolhido>): Promise<Acolhido> {
    return api.put(`/residents/${id}`, data);
  }

  async excluir(id: string) {
    return api.delete(`/residents/${id}`);
  }
}

export default new ResidentService();
