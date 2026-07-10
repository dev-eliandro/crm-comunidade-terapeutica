import ResidentService from "../services/ResidentService.js";

class ResidentController {
async create(req, res) {

    try {

        const resident = await ResidentService.create(req.body);

        return res.status(201).json(resident);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: error.message
        });

    }

}
    async list(req, res) {
        const residents = await ResidentService.list();
        res.json(residents);
    }

    async get(req, res) {
        const resident = await ResidentService.get(req.params.id);
        res.json(resident);
    }

    async create(req, res) {

        const resident = await ResidentService.create(req.body);

        res.status(201).json(resident);

    }

    async update(req, res) {

        const resident = await ResidentService.update(
            req.params.id,
            req.body
        );

        res.json(resident);

    }

    async delete(req, res) {

        await ResidentService.delete(req.params.id);

        res.sendStatus(204);

    }

}

export default new ResidentController();