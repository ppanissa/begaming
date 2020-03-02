'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class JobRoleSchema extends Schema {
  up() {
    this.create('config_job_roles', table => {
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
    this.drop('config_job_roles');
  }
}

module.exports = JobRoleSchema;
