import api from "./api";
import { MedicationLog } from "../types";

class MedicationLogService {
  async listar(): Promise<MedicationLog[]> {
    return api.get("/medication-logs");
  }

  // Substitui todo o conjunto de logs no backend pelo array atual em memória.
  // Mantém o mesmo padrão de "array único sincronizado" que o app já usava
  // localmente, só que agora persistido no banco (compartilhado entre dispositivos).
  async sincronizar(logs: MedicationLog[]): Promise<MedicationLog[]> {
    return api.put("/medication-logs", { logs });
  }
}

export default new MedicationLogService();
