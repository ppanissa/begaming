'use strict';

const Route = use('Route');
const Helpers = use('Helpers');

const routeApi = 'api/v1';

/**
 * Auth
 */
Route.group(() => {
  Route.post('auth/register', 'AuthController.register').as('auth.register');
  Route.post('auth/register-confirm', 'AuthController.registerConfirm').as(
    'auth.register-confirm',
  );
  Route.post('auth/login', 'AuthController.login').as('auth.login');
  Route.post('auth/refresh-token', 'AuthController.refreshToken')
    .middleware(['auth:jwt'])
    .as('auth.refresh-token');
  Route.post('auth/recovery-password', 'AuthController.recoveryPassword').as(
    'auth.recovery-password',
  );
  Route.post('auth/renew-password', 'AuthController.renewPassword').as(
    'auth.renew-password',
  );
})
  .prefix(`${routeApi}/`)
  .namespace('Auth');

/**
 * Users
 */
Route.group(() => {
  Route.resource('users', 'UserController')
    .except(['create', 'edit'])
    .apiOnly();
})
  .prefix(`${routeApi}/`)
  .namespace('User')
  .middleware(['auth:jwt']);

/**
 * Config
 */
Route.group(() => {
  Route.resource('job-roles', 'JobRoleController')
    .except(['create', 'edit'])
    .apiOnly();
  Route.resource('teams', 'TeamController')
    .except(['create', 'edit'])
    .apiOnly();
})
  .prefix(`${routeApi}/config`)
  .namespace('Config')
  .middleware(['auth:jwt']);

/**
 * Badges
 */
Route.group(() => {
  Route.resource('', 'BadgeController')
    .except(['create', 'edit'])
    .apiOnly();
  Route.resource('/ranking', 'BadgeController')
    .except(['create', 'edit'])
    .apiOnly();
})
  .prefix(`${routeApi}/badges`)
  .namespace('Badge')
  .middleware(['auth:jwt']);

/**
 * File Service
 */
Route.group(() => {
  Route.resource('files', 'FileController')
    .except(['index', 'create', 'edit', 'update'])
    .apiOnly();
})
  .prefix(`${routeApi}/`)
  .namespace('File')
  .middleware(['auth:jwt']);

/**
 * return user files
 * @param {email,file}
 * @returs {file}
 */
Route.get('file/:id/:file', async ({ response, params }) => {
  // where :file is file name
  return response.download(
    Helpers.tmpPath(`uploads/${params.id}/${params.file}`),
  );
})
  .as('file.index')
  .prefix(routeApi);
