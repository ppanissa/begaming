'use strict';

const Model = use('Model');

class JobRole extends Model {
  static get table() {
    return 'config_job_roles';
  }

  profiles() {
    return this.hasMany('App/Models/Account/Profile', 'id', 'job_id');
  }
}

module.exports = JobRole;
