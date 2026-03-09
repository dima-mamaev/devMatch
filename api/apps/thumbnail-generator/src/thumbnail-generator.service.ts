import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Queue } from 'bullmq';
import { GenerateThumbnailOutputData } from '../../../types/types';

@Injectable()
export class ThumbnailGeneratorService {
  constructor(
    @InjectQueue('GeneratorOutputQueue')
    private readonly queue: Queue,
  ) {}

  async generateThumbnailFromVideo(videoUrl: string): Promise<Buffer> {
    console.log('[Thumbnail] Generating thumbnail from video:', videoUrl);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--no-first-run',
        '--autoplay-policy=no-user-gesture-required',
      ],
    });
    console.log('[Thumbnail] Browser launched');

    try {
      const page = await browser.newPage();
      console.log('[Thumbnail] New page created');

      // Listen to browser console for debugging
      page.on('console', (msg) => console.log('[Browser]', msg.text()));
      page.on('pageerror', (err) => console.error('[Browser Error]', String(err)));
      await page.setViewport({ width: 640, height: 360 });

      // Create HTML with video player that auto-seeks to 1 second
      // Videos are guaranteed to be MP4 (H.264) from the video converter
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { margin: 0; padding: 0; }
            body { background: #000; display: flex; align-items: center; justify-content: center; height: 100vh; }
            video { width: 100%; height: 100%; object-fit: contain; }
          </style>
        </head>
        <body>
          <video id="video" muted crossorigin="anonymous" preload="auto">
            <source src="${videoUrl}" type="video/mp4">
          </video>
          <script>
            const video = document.getElementById('video');

            console.log('Video element found:', !!video);
            console.log('Video src:', video?.querySelector('source')?.src);

            video.addEventListener('loadstart', () => {
              console.log('Video: loadstart');
            });

            video.addEventListener('loadeddata', () => {
              console.log('Video: loadeddata, readyState:', video.readyState);
            });

            video.addEventListener('loadedmetadata', () => {
              console.log('Video: loadedmetadata, duration:', video.duration);
              // Seek to 1 second or middle of video if shorter
              video.currentTime = Math.min(1, video.duration / 2);
              console.log('Video: seeking to', video.currentTime);
            });

            video.addEventListener('seeked', () => {
              console.log('Video: seeked to', video.currentTime, 'readyState:', video.readyState);
              // Play briefly to ensure frame is rendered
              video.play().then(() => {
                console.log('Video: playing');
                setTimeout(() => {
                  video.pause();
                  console.log('Video: paused');
                }, 100);
              }).catch((err) => {
                console.error('Video: play error', err.message);
              });
            });

            video.addEventListener('error', (e) => {
              console.error('Video error:', video.error?.message || 'unknown');
            });

            console.log('Starting video load...');
            video.load();
          </script>
        </body>
        </html>
      `;

      console.log('[Thumbnail] Setting page content...');
      await page.setContent(html, {
        waitUntil: 'domcontentloaded', // Don't wait for network - video will stream
        timeout: 30000,
      });
      console.log('[Thumbnail] Page content set, waiting for video to load...');

      // Wait for video to load and seek to target time
      await page.waitForFunction(() => {
        const video = document.getElementById('video') as HTMLVideoElement;
        if (!video) return false;
        // Check if video has loaded and seeked (currentTime > 0 means seek completed)
        return video.readyState >= 3 && video.currentTime > 0;
      }, { timeout: 60000 });
      console.log('[Thumbnail] Video loaded and seeked');

      // Small delay to ensure frame is fully rendered
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log('[Thumbnail] Taking screenshot...');
      const screenshot = await page.screenshot({
        type: 'webp',
        quality: 85,
        optimizeForSpeed: true,
      });
      console.log('[Thumbnail] Screenshot taken, size:', screenshot.length);

      return Buffer.from(screenshot);
    } finally {
      console.log('[Thumbnail] Closing browser');
      await browser.close();
    }
  }

  async enqueueGenerateThumbnailOutput(data: GenerateThumbnailOutputData) {
    return this.queue.add('GenerateThumbnailOutput', data);
  }
}
