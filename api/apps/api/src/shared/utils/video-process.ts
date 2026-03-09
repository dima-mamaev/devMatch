import { resolve } from 'path';
import { unlink } from 'fs/promises';
import { spawn } from 'child_process';

export const videoProcess = async (
  filename: string,
  tmpPath: string,
): Promise<string> => {
  const outputPath = resolve(`tmp_files/${filename}`);

  return new Promise((resolve, reject) => {
    let processClosed = false;
    let stderrOutput = '';
    const ffmpegProcess = spawn('ffmpeg', [
      '-i',
      tmpPath,
      '-c',
      'copy',
      '-movflags',
      '+frag_keyframe+empty_moov+faststart',
      outputPath,
    ]);

    ffmpegProcess.stderr?.on('data', (data: Buffer) => {
      stderrOutput += data.toString();
    });

    ffmpegProcess.on('error', (err) => {
      console.error(`FFmpeg process failed: ${err.message}`);
      if (processClosed) return;
      processClosed = true;
      reject(err);
    });

    ffmpegProcess.on('close', (code) => {
      if (processClosed) return;
      processClosed = true;
      if (code === 0) {
        console.log(`Stream converting finished successfully: ${outputPath}`);
        void unlink(tmpPath);
        resolve(outputPath);
      } else {
        const err = new Error(`Stream converting failed with code: ${code}`);
        console.error(`ffmpeg stderr:\n${stderrOutput}`);
        reject(err);
      }
    });
  });
};
