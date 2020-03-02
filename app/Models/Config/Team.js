'use strict';

const Model = use('Model');

class Team extends Model {
  static get table() {
    return 'config-teams';
  }

  profiles() {
    return this.hasMany('App/Models/Account/Profile', 'id', 'team_id');
  }
}

module.exports = Team;
