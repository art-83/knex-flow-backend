import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UploadFileService } from '../../../services/files/upload-file.service';

class FileController {
  public async upload(request: Request, response: Response): Promise<Response> {
    const uploadFileService = container.resolve(UploadFileService);
    const file = await uploadFileService.execute(request.user_id, request.file);
    return response.status(201).json(file);
  }
}
export { FileController };
