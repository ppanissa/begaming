'use strict';

const Schema = use('Schema');

class DatabaseFuncsSchema extends Schema {
  async up() {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    // this.createExtensionIfNotExists('postgis');
  }

  down() {}
}

module.exports = DatabaseFuncsSchema;
