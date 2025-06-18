import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with configuration
  app.enableCors({
    origin: 'http://localhost:5173', // Your React frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Car Trade App API')
    .setDescription('API documentation for the Car Trade Application')
    .setVersion('1.0')
    .addBearerAuth() // For JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // accessible at /api

  await app.listen(3000);
  console.log('🚀 Server is running on http://localhost:3000');
} 
bootstrap();
