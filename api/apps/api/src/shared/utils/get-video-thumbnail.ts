import { resolve } from 'path';
import { spawn } from 'child_process';

export const getVideoThumbnail = async (
  inputPath: string,
  filename: string,
): Promise<string> => {
  const outputPath = resolve(`tmp_files/${filename}_thumb.jpg`);

  return new Promise((resolve, reject) => {
    let processClosed = false;
    let stderrOutput = '';
    const ffmpegProcess = spawn('ffmpeg', [
      '-y',
      '-ss',
      '00:00:01',
      '-i',
      inputPath,
      '-frames:v',
      '1',
      '-q:v',
      '2',
      outputPath,
    ]);

    ffmpegProcess.stderr?.on('data', (data: Buffer) => {
      stderrOutput += data.toString();
    });

    ffmpegProcess.on('error', (err) => {
      if (processClosed) return;
      processClosed = true;
      reject(err);
    });

    ffmpegProcess.on('close', (code) => {
      if (processClosed) return;
      processClosed = true;
      if (code === 0) {
        resolve(outputPath);
      } else {
        const err = new Error(`FFmpeg thumbnail failed with code: ${code}`);

        console.error(`ffmpeg stderr:\n${stderrOutput}`);
        reject(err);
      }
    });
  });
};
