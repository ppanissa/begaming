'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ProfileSchema extends Schema {
  up() {
    this.create('account_profiles', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'));
      table
        .uuid('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .uuid('avatar_id')
        .unsigned()
        .references('id')
        .inTable('files');
      table.date('date_of_birth');
      table.timestamps();
    });
  }

  down() {
    this.drop('account_profiles');
  }
}

module.exports = ProfileSchema;
