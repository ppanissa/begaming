'use strict';

const JobRole = use('App/Models/Config/JobRole');
const HttpStatus = require('http-status-codes');

class JobRoleController {
  async index({ request, response, view }) {
    try {
      const { page = 1, limit = 50 } = request.get();

      const jobRoles = await JobRole.query()
        .select('id', 'name', 'description')
        .paginate(page, limit);

      return response.status(HttpStatus.OK).json({ data: jobRoles });
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async store({ request, response }) {
    try {
      const data = request.only(['name', 'description']);

      await JobRole.create(data);

      return response
        .status(HttpStatus.CREATED)
        .json({ data: 'Função criada com sucesso' });
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async show({ params, request, response, view }) {
    try {
      const { id } = params;

      const jobRole = await JobRole.findOrFail(id);

      return response.status(HttpStatus.OK).json({ data: jobRole });
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;

      const jobRole = await JobRole.findOrFail(id);

      const data = request.only(['name', 'description']);

      await jobRole.merge(data);

      await jobRole.save();

      return response
        .status(HttpStatus.OK)
        .json({ data: 'Função alterado com sucesso' });
    } catch (e) {
      console.log(e);
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async destroy({ params, response }) {
    try {
      const { id } = params;

      const jobRole = await JobRole.find(id);

      await jobRole.delete();

      return response
        .status(HttpStatus.OK)
        .json({ data: 'Função foi deletada com sucesso!' });
    } catch (e) {
      console.log(e);
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }
}

module.exports = JobRoleController;
