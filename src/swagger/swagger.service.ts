import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envConfig } from '@config/env.config';

@Injectable()
export class SwaggerService {
  private readonly config = envConfig();

  setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('AlgoMonkey Gateway API')
      .setDescription('API Documentation')
      .setVersion('1.0')
      .addCookieAuth('access_token', {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
      })
      .addServer(this.config.SWAGGER_URL)
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        requestInterceptor: (req: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          req.credentials = 'include';
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return req;
        },
      },
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    });
  }
}
