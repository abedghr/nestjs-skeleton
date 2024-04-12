import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { IFile, IFileDetails } from '../interfaces/file.interface';

@Injectable()
export class FileHelperService {
  constructor(private readonly helperStringService: HelperStringService) {}
  
  async prepareFileDetails(file: IFile, uploadPath: string, dirId?: string|null): Promise<IFileDetails> {
    const fileOriginalName: string = file.originalname;
    console.log("fileOriginalName : ", fileOriginalName);
    
    const content: Buffer = file.buffer;
    const mime: string = fileOriginalName
      .substring(fileOriginalName.lastIndexOf('.') + 1, fileOriginalName.length)
      .toUpperCase();

    const imageFileName:  Record<string, any> = this.createImageFileName(uploadPath);
    const fileName: string = `${imageFileName.imageName}.${mime}`;
    const path: string = dirId ? `${imageFileName.path}/${dirId}` : imageFileName.path;

    return {
        fileName,
        content,
        path
    };
  }
  
  createImageFileName(uploadPath: string): Record<string, any> {
    const imageName: string = this.helperStringService.random(20);
    return {
      path: uploadPath,
      imageName: imageName,
    };
  }
}
