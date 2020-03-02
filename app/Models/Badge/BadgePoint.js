'use strict';

const Model = use('Model');

class BadgePoint extends Model {
  badge() {
    return this.belongsToMany('App/Models/Badge/Badge', 'badge_id', 'id');
  }

  file() {
    return this.belongsTo('App/Models/File/File', 'file_id', 'id');
  }
}

module.exports = BadgePoint;
