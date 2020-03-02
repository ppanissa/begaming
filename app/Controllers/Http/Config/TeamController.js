'use strict';

const Team = use('App/Models/Config/Team');
const HttpStatus = require('http-status-codes');

class TeamController {
  async index({ request, response, view }) {
    try {
      const { page = 1, limit = 50 } = request.get();

      const teams = await Team.query()
        .select('id', 'name', 'description')
        .paginate(page, limit);

      return response.status(HttpStatus.OK).json({ data: teams });
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async store({ request, response }) {
    try {
      const data = request.only(['name', 'description']);

      await Team.create(data);

      return response
        .status(HttpStatus.CREATED)
        .json({ data: 'Time criado com sucesso' });
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async show({ params, request, response, view }) {
    try {
      const { id } = params;

      const team = await Team.findOrFail(id);

      return response.status(HttpStatus.OK).json({ data: team });
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;

      const team = await Team.findOrFail(id);

      const data = request.only(['name', 'description']);

      await team.merge(data);

      await team.save();

      return response
        .status(HttpStatus.OK)
        .json({ data: 'Team alterado com sucesso' });
    } catch (e) {
      console.log(e);
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async destroy({ params, response }) {
    try {
      const { id } = params;

      const team = await Team.find(id);

      await team.delete();

      return response
        .status(HttpStatus.OK)
        .json({ data: 'Team foi deletada com sucesso!' });
    } catch (e) {
      console.log(e);
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }
}

module.exports = TeamController;
