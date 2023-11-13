import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { extension } from 'mime-types';
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';

import { HttpError } from '../index.js';
import { Middleware } from './middleware.interface.js';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private allowedMimeTypes?: string[],
    private fileCount?: number
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        if (!fileExtension) {
          return callback(new HttpError(
            StatusCodes.BAD_REQUEST,
            'Incorrect extension',
          ), '');
        }
        if (!this.allowedMimeTypes || this.allowedMimeTypes.includes(fileExtension)) {
          const filename = nanoid();
          return callback(null, `${filename}.${fileExtension}`);
        }

        return callback(new HttpError(
          StatusCodes.BAD_REQUEST,
          `Wrong file extension, allowed extensions: ${this.allowedMimeTypes}`,
        ), '');
      }
    });

    const uploadFileMiddleware = multer({ storage });

    if (this.fileCount && this.fileCount > 1) {
      return uploadFileMiddleware.array(this.fieldName, this.fileCount)(req, res, next);
    }


    return uploadFileMiddleware.single(this.fieldName)(req, res, next);
  }
}
