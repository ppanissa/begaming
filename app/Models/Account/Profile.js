'use strict';

const Model = use('Model');
const { parse, format } = require('date-fns');

class Profile extends Model {
  static get table() {
    return 'account_profiles';
  }

  static get hidden() {
    return [
      'created_at',
      'updated_at',
      'user_id',
      'avatar_id',
      'team_id',
      'job_id',
    ];
  }

  /**
   * Mutators
   */
  // Set
  setDateOfBirth(date) {
    const dateParse = parse(date, 'dd/MM/yyyy', new Date());
    return dateParse;
  }

  // Get
  getDateOfBirth(date) {
    const dateFormat = format(date, 'dd/MM/yyyy');
    return dateFormat;
  }

  /**
   * Relationship
   */
  avatar() {
    return this.belongsTo('App/Models/File/File', 'avatar_id', 'id');
  }

  jobRole() {
    return this.belongsTo('App/Models/Config/JobRole', 'job_id', 'id');
  }

  team() {
    return this.belongsTo('App/Models/Config/Team', 'team_id', 'id');
  }
}

module.exports = Profile;
