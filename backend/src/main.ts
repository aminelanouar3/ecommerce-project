import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    json({
      verify: (req: any, _res, buf) => {
        if (req.originalUrl.includes('/payment/webhook')) {
          req.rawBody = buf;
        }
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
