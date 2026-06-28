import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseStructure } from './interceptor/response.interceptor';
const port = process.env.PORT ?? 3001
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseStructure())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  })), // apply validation global
    await app.listen(port, () => {
      console.log(`server run or port ${port}`)
    });
}
bootstrap();
