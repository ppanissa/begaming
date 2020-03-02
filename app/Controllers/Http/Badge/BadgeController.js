'use strict';

const Badge = use('App/Models/Badge/Badge');
const HttpStatus = require('http-status-codes');

class BadgeController {
  async index({ request, response, view }) {
    try {
      const badges = await Badge.query()
        .with('points', builder => {
          return builder.with('file');
        })
        .fetch();
      return response.status(HttpStatus.OK).json({ data: badges });
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async store({ request, response }) {
    try {
      const { points, ...data } = request.only([
        'name',
        'description',
        'points',
      ]);

      const save = await Badge.create(data);

      if (points && points.lenght > 0) {
        await save.points().createMany(points);
      }

      return response
        .status(HttpStatus.CREATED)
        .json({ data: 'Badge criado com sucesso ' });
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async show({ params, request, response, view }) {
    try {
      const { id } = params;

      const badge = await Badge.findOrFail(id);

      await badge.load('points', builder => {
        return builder.with('file');
      });
      return response.status(HttpStatus.OK).json({ data: badge });
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;

      const badge = await Badge.findOrFail(id);

      const { points, ...data } = request.only([
        'name',
        'description',
        'points',
      ]);

      await badge.merge(data);

      await badge.points().createMany(points);

      return response
        .status(HttpStatus.CREATED)
        .json({ data: 'Badge foi atualizado com sucesso' });
    } catch (e) {
      console.log(e);
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async destroy({ params, request, response }) {
    try {
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }
}

module.exports = BadgeController;
