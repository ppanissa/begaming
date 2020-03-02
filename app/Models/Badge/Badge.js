'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Badge extends Model {
  points() {
    return this.hasMany('App/Models/Badge/BadgePoint', 'id', 'badge_id');
  }
}

module.exports = Badge;
