'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RankSchema extends Schema {
  up() {
    this.create('ranks', table => {
      table.increments();
      table
        .integer('badge_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('badges')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .uuid('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.integer('point').defaultTo(0);
      table.timestamps();
    });
  }

  down() {
    this.drop('ranks');
  }
}

module.exports = RankSchema;
