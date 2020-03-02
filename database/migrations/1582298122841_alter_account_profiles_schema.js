'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AlterAccountProfilesSchema extends Schema {
  up() {
    this.table('account_profiles', table => {
      table
        .integer('job_id')
        .unsigned()
        .references('id')
        .inTable('config_job_roles')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');

      table
        .integer('team_id')
        .unsigned()
        .references('id')
        .inTable('config_teams')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });
  }

  down() {
    this.table('account_profiles', table => {
      // reverse alternations
      table.dropColumn('job_id');
      table.dropColumn('team_id');
    });
  }
}

module.exports = AlterAccountProfilesSchema;
