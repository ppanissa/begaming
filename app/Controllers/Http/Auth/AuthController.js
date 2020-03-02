'use strict';

const Bull = use('Rocketseat/Bull');
const JobUserRegister = use('App/Jobs/Auth/UserRegister');
const JobUserConfirmed = use('App/Jobs/Auth/UserConfirmed');
const JobUserResendActive = use('App/Jobs/Auth/UserResendActive');
const JobUserRecoveryPassword = use('App/Jobs/Auth/UserRecoveryPassword');
const User = use('App/Models/User');
const HttpStatus = require('http-status-codes');
const crypto = require('crypto');
const { validateEmail } = use('App/Helpers');
const { subDays, isAfter } = require('date-fns');

class AuthController {
  async register({ request, response }) {
    try {
      const { confirm_url: confirmUrl, ...data } = request.only([
        'name',
        'username',
        'email',
        'password',
        'confirm_url',
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
      // create token hash and set datetime
      data.token = crypto.randomBytes(10).toString('hex');
      data.token_created_at = new Date();
      // Save
      const { email, token } = await User.create(data);

      const url = `${confirmUrl}/${token}`;

      const dataMail = {
        email,
        url,
      };

      Bull.add(JobUserRegister.key, dataMail);

      return response.status(HttpStatus.CREATED).json({
        data:
          'Usuário criado com sucesso, confirme em seu e-mail, para liberarmos acesso',
      });
    } catch (e) {
      console.log(e);
      return response.status(e.status).json({ error: { message: e.message } });
    }
  }

  async registerConfirm({ request, response }) {
    try {
      const { hash, confirm_url: confirmUrl } = request.only([
        'hash',
        'confirm_url',
      ]);

      const user = await User.findByOrFail('token', hash);

      const tokenExpiredAt = isAfter(
        subDays(new Date(), 2),
        user.token_created_at,
      );

      if (tokenExpiredAt) {
        // create token hash and set datetime
        user.token = crypto.randomBytes(10).toString('hex');
        user.token_created_at = new Date();

        await user.save();

        const url = `${confirmUrl}/${user.token}`;

        const dataMail = {
          email: user.email,
          url,
        };

        Bull.add(JobUserResendActive.key, dataMail);

        const error = {
          status: HttpStatus.UNAUTHORIZED,
          message:
            'Tempo para renovar expirou, enviei outro e-mail de ativação ;)',
        };
        return response.status(error.status).json({
          error: { message: error.message },
        });
      }

      user.token = null;
      user.token_created_at = null;
      user.is_active = true;

      await user.save();

      Bull.add(JobUserConfirmed.key, user);

      return response
        .status(HttpStatus.OK)
        .json({ data: 'Usuário foi confirmado com sucesso' });
    } catch (e) {
      return response
        .status(e.status)
        .json({ error: { message: 'Não foi possível localizar ;(' } });
    }
  }

  async login({ auth, request, response }) {
    try {
      const { login, password } = request.only(['login', 'password']);

      const bodyField = validateEmail(login)
        ? { field: 'email', jwt: 'jwt' }
        : { field: 'username', jwt: 'jwtUsername' };

      const userExistIsActive = await User.query()
        .where(bodyField.field, login)
        .first();

      if (!userExistIsActive) {
        const err = {
          status: HttpStatus.NOT_FOUND,
          message: 'Usuário não foi encontrado',
        };
        throw err;
      }

      if (userExistIsActive && !userExistIsActive.is_active) {
        const err = {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Usuário aguardando liberação de acesso',
        };
        throw err;
      }

      const token = await auth
        .authenticator(bodyField.jwt)
        .withRefreshToken()
        .attempt(login, password);

      return response.status(HttpStatus.OK).json({ data: token });
    } catch (e) {
      return response.status(e.status).send({ error: { message: e.message } });
    }
  }

  async refreshToken({ request, response, auth }) {
    try {
      const refreshToken = request.input('refresh_token');

      const token = await auth
        .newRefreshToken()
        .generateForRefreshToken(refreshToken);

      return response.status(HttpStatus.OK).json({ data: token });
    } catch (e) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .send({ error: { message: 'Não foi autorizado o refresh token' } });
    }
  }

  async recoveryPassword({ request, response }) {
    try {
      const { email, confirm_url: confirmUrl } = request.only([
        'email',
        'confirm_url',
      ]);

      const user = await User.findByOrFail('email', email);

      user.token = crypto.randomBytes(20).toString('hex');
      user.token_created_at = new Date();

      await user.save();

      const data = {
        user,
        recovery: `${confirmUrl}/${user.token}`,
      };

      Bull.add(JobUserRecoveryPassword.key, data);

      return response.send({
        data:
          'Foi enviado ao seu email, as informações para recuperação da senha',
      });
    } catch (e) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: { message: 'Este e-mail existe?' } });
    }
  }

  async renewPassword({ request, response, params }) {
    try {
      const data = request.only(['hash', 'password', 'confirm_password']);

      const user = await User.findByOrFail('token', data.hash);

      const tokenExpiredAt = isAfter(
        subDays(new Date(), 2),
        user.token_created_at,
      );

      if (tokenExpiredAt) {
        const error = {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Tempo para renovar sua senha expirou',
        };
        throw error;
      }

      user.token = null;
      user.token_created_at = null;
      user.password = data.password;

      await user.save();

      return response
        .status(HttpStatus.OK)
        .send({ data: 'Senha foi alterada com sucesso' });
    } catch (e) {
      return response.status(e.status).send({
        error: { message: e.message },
      });
    }
  }
}

module.exports = AuthController;
