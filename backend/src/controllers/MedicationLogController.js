import MedicationLogService from "../services/MedicationLogService.js";

class MedicationLogController {

  async list(req, res) {
    try {
      const logs = await MedicationLogService.list();
      res.json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  async replaceAll(req, res) {
    try {
      const logs = await MedicationLogService.replaceAll(req.body.logs || []);
      res.json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}

export default new MedicationLogController();
