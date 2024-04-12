export type IFile = Express.Multer.File;

export type IFileExtract<T = Record<string, any>> = IFile & {
    extract: Record<string, any>[];
    dto?: T[];
};

export type IFileDetails = {
    fileName: string;
    content: Buffer;
    path: string;
}
