import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/redis/redis.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    UserModule,
    BrandModule,
    CategoryModule, ProductModule,
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.development", ".env.production"],
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('connected db success'));

        return connection;
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
