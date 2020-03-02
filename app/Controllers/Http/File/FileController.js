'use strict';

const HttpStatus = require('http-status-codes');
const FileService = use('App/Services/File/FileService');

class FileController {
  async store({ request, response }) {
    try {
      const file = request.file('file');

      if (file && Array.isArray(file._files)) {
        const filesCreate = await FileService.uploadMultipleFiles(file._files);

        return response.status(HttpStatus.CREATED).json({ data: filesCreate });
      }

      const fileCreate = await FileService.uploadSingleFile(file);

      return response.status(HttpStatus.CREATED).json({
        data: fileCreate,
      });
    } catch (e) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        error: {
          message: 'O arquivo enviado falhou...',
        },
      });
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;

      const file = await FileService.getFile(id);

      return response.status(HttpStatus.OK).json(file);
    } catch (e) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message:
          'Não localizei o que procura, faz seguinte, tente novamente. hahaha',
      });
    }
  }

  async destroy({ params, request, response }) {
    try {
      const { id } = params;

      await FileService.deleteFile(id);

      return response
        .status(HttpStatus.OK)
        .json({ message: 'Arquivo removido com sucesso.' });
    } catch (e) {
      console.log(e);
      return response.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Deu um B.O.zinho para excluír o arquivo...',
      });
    }
  }
}

module.exports = FileController;
