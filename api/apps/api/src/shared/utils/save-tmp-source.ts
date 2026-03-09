import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { CustomUpload } from '../../custom-upload/model/upload';

export const saveTmpSource = async (file: CustomUpload) => {
  const filename = `${Date.now()}_${file.filename.replace(/\s/, '')}`;
  const tmpPath = resolve(`tmp_files/source_${filename}`);
  await writeFile(tmpPath, file.buffer);

  return { filename, tmpPath };
};
