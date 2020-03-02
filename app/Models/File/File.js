'use strict';

const Model = use('Model');
const Env = use('Env');

class File extends Model {
  static get table() {
    return 'files';
  }

  static get computed() {
    return ['url'];
  }

  getUrl({ id, name }) {
    const url = Env.get('APP_URL');

    return `${url}/api/v1/file/${id}/${name}`;
  }

  profile() {
    return this.hasOne('App/Models/Account/Profile', 'id', 'avatar_id');
  }

  badge() {
    return this.hasOne('App/Models/Badge/BadgePoint', 'id', 'file_id');
  }
}

module.exports = File;
