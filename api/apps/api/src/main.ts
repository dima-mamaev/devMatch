import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import helmet from 'helmet';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './shared/pipes/custom-validation.pipe';
import { SharedModule } from './shared/shared.module';
import { RoleGuard } from './shared/guards/role.guard';
import { UserContextInterceptor } from './shared/interceptors/user-context.interceptor';
import { SystemGuard } from './shared/guards/system.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);
  const sharedModule = app.select(SharedModule);

  app.enableCors();
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );
  app.useGlobalGuards(sharedModule.get(SystemGuard));
  app.useGlobalGuards(sharedModule.get(RoleGuard));
  app.useGlobalInterceptors(sharedModule.get(UserContextInterceptor));
  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException(errors, 'Validation Error'),
    }),
  );
  app.use(graphqlUploadExpress({ maxFileSize: 314572800, maxFiles: 10 }));

  useContainer(app.select(AppModule), {
    fallback: true,
    fallbackOnErrors: true,
  });

  await app.listen(config.get<number>('PORT')!);
}
void bootstrap();
