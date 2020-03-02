'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TeamSchema extends Schema {
  up() {
    this.create('config_teams', table => {
      table.increments();
      table
        .string('name')
        .unique()
        .notNullable();
      table.string('description');
      table.timestamps();
    });
  }

  down() {
    this.drop('config_teams');
  }
}

module.exports = TeamSchema;
