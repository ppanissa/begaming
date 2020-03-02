'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class FileSchema extends Schema {
  up() {
    this.create('files', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.string('real_name').nullable();
      table.string('extname').notNullable();
      table.string('size').notNullable();
      table.string('type').notNullable();
      table.string('subtype').notNullable();
      table
        .integer('views')
        .default(0)
        .nullable()
        .unsigned();
      table.timestamps();
    });
  }

  down() {
    this.drop('files');
  }
}

module.exports = FileSchema;
