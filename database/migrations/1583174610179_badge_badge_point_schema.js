'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BadgeFileSchema extends Schema {
  up() {
    this.create('badge_points', table => {
      table.increments();
      table.string('type');
      table
        .integer('badge_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('badges')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .uuid('file_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('files')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
      table.integer('point').unsigned();
      table.timestamps();
    });
  }

  down() {
    this.drop('badge_points');
  }
}

module.exports = BadgeFileSchema;
