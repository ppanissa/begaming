'use strict';

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/auth/providers/AuthProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  'adonis-acl/providers/AclProvider',
  '@sci-ventures/adonis-swagger/providers/SwaggerProvider',
  '@adonisjs/lucid/providers/LucidProvider',
  '@adonisjs/drive/providers/DriveProvider',
  '@rocketseat/adonis-bull/providers/Bull',
  '@adonisjs/framework/providers/ViewProvider',
  '@adonisjs/mail/providers/MailProvider',
  '@adonisjs/websocket/providers/WsProvider',
  '@adonisjs/vow/providers/VowProvider',
];

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = ['@adonisjs/lucid/providers/MigrationsProvider'];

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {};

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [];

module.exports = { providers, aceProviders, aliases, commands };
