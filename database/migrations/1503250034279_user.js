'use strict';

const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'));
      table.string('name');
      table
        .string('username', 80)
        .notNullable()
        .unique();
      table
        .string('email', 254)
        .notNullable()
        .unique();
      table.string('password', 60).notNullable();
      table.boolean('is_active').defaultTo(false);
      table.string('token').unique();
      table.date('token_created_at');
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
