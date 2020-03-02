const fs = require('fs');
const Config = use('Config');
const Helpers = use('Helpers');
const File = use('App/Models/File/File');
const slugify = require('slugify');

class FileService {
  static async uploadSingleFile(file) {
    const { clientName, extname, size, type, subtype } = file;
    // Generate Path Name
    const client = clientName.split('.');
    client.splice(-1, 1);
    client.join(' ');
    const [realName] = client;
    const name = slugify(clientName, {
      replacement: '-',
      remove: null,
      lower: true,
    });

    const fileCreate = await File.create({
      name,
      real_name: realName,
      extname,
      size,
      type,
      subtype,
    });

    await file.move(Helpers.tmpPath(`uploads/${fileCreate.id}`), {
      name: fileCreate.name,
      overwrite: true,
    });

    return fileCreate;
  }

  static async uploadMultipleFiles(files) {
    const uploads = [];
    for (const file of files) {
      uploads.push(await this.uploadSingleFile(file));
    }
    return uploads;
  }

  static async getFile(id) {
    const file = await File.find(id);

    if (file && Config.get('before.files.views')) {
      file.views = file.views + 1;
      file.save();
    }
    return file;
  }

  static async deleteFile(id) {
    const file = await File.find(id);

    const removeFile = Helpers.promisify(fs.unlink);

    await removeFile(Helpers.tmpPath(`uploads/${file.id}/${file.name}`));

    await file.delete();
  }
}

module.exports = FileService;
