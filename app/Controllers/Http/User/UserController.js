'use strict';

const User = use('App/Models/User');
const Profile = use('App/Models/Account/Profile');
const HttpStatus = require('http-status-codes');

class UserController {
  async index({ request, response }) {
    try {
      const { page = 1, limit = 50 } = request.get();

      const users = await User.query()
        .select('id', 'name', 'username', 'email')
        .with('profile', builder => {
          return builder.with('avatar');
        })
        .paginate(page, limit);

      return response.status(HttpStatus.OK).json(users);
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async store({ request, response }) {
    try {
      const { profile, ...data } = request.only([
        'name',
        'username',
        'email',
        'password',
        'profile',
      ]);

      const userExists = await User.query()
        .select('username', 'email', 'is_active')
        .where('email', data.email)
        .where('username', data.username)
        .first();

      if (userExists) {
        let err = {};
        if (!userExists.is_active) {
          err = {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Usuário já foi criado, aguardando liberação de acesso',
          };
        } else {
          err = {
            status: HttpStatus.NOT_ACCEPTABLE,
            message: 'Usuário já cadastrado',
          };
        }
        throw err;
      }

      data.is_active = true;

      const { id } = await User.create(data);

      if (profile) {
        profile.user_id = id;
        await Profile.create(profile);
      }

      return response.status(HttpStatus.CREATED).json({
        data: 'Usuário foi criado com sucesso',
      });
    } catch (e) {
      console.log(e);
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async show({ request, params, response }) {
    try {
      const { id } = params;
      const user = await User.query()
        .select('id', 'name', 'username', 'email')
        .where('id', '=', id)
        .with('profile', builder => builder.with('avatar'))
        .first();
      return response.status(HttpStatus.OK).json({ data: user });
    } catch (e) {
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async update({ request, params, response }) {
    try {
      const { id } = params;

      const user = await User.findOrFail(id);

      const { profile, ...data } = request.only([
        'name',
        'username',
        'email',
        'password',
        'profile',
      ]);

      await user.merge(data);

      await user.save();

      if (profile) {
        profile.user_id = user.id;
        const dataProfile = await Profile.query()
          .where('user_id', user.id)
          .first();

        if (dataProfile) {
          await dataProfile.merge(profile);
          await dataProfile.save();
        } else {
          await user.profile().create(profile);
        }
      }

      return response
        .status(HttpStatus.OK)
        .json({ data: 'Usuário alterado com sucesso' });
    } catch (e) {
      console.log(e);
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async destroy({ request, params, response }) {
    try {
      const { id } = params;

      const user = await User.find(id);

      await user.delete();

      return response
        .status(HttpStatus.OK)
        .json({ data: 'Usuário foi deletado com sucesso!' });
    } catch (e) {
      console.log(e);
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }
}

module.exports = UserController;
