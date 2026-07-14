import ResidentService from "../services/ResidentService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class ResidentController {
  create = asyncHandler(async (req, res) => {
    const resident = await ResidentService.create(req.body);
    res.status(201).json(resident);
  });

  list = asyncHandler(async (req, res) => {
    const residents = await ResidentService.list();
    res.json(residents);
  });

  get = asyncHandler(async (req, res) => {
    const resident = await ResidentService.get(req.params.id);
    res.json(resident);
  });

  update = asyncHandler(async (req, res) => {
    const resident = await ResidentService.update(req.params.id, req.body);
    res.json(resident);
  });

  delete = asyncHandler(async (req, res) => {
    await ResidentService.delete(req.params.id);
    res.sendStatus(204);
  });
}

export default new ResidentController();
