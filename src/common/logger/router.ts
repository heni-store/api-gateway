import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

interface ExpressLayer {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
}

interface ExpressRouter {
  stack: ExpressLayer[];
}

@Injectable()
export class RoutesLogger implements OnModuleInit {
  private readonly logger = new Logger('Routes');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  onModuleInit(): void {
    const httpAdapter = this.httpAdapterHost.httpAdapter;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const instance = httpAdapter.getInstance();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unnecessary-type-assertion
    const router = (instance as any)._router as ExpressRouter;

    if (!router?.stack) {
      this.logger.warn('Could not extract routes');
      return;
    }

    const routes: string[] = [];

    router.stack
      .filter(
        (
          layer,
        ): layer is ExpressLayer & {
          route: NonNullable<ExpressLayer['route']>;
        } => Boolean(layer.route),
      )
      .forEach((layer) => {
        const methods = Object.keys(layer.route.methods)
          .map((m) => m.toUpperCase())
          .join(', ');
        routes.push(`${methods.padEnd(6)} ${layer.route.path}`);
      });

    this.logger.log('🚀 Registered routes:');
    routes.sort().forEach((route) => this.logger.log(`  ➜ ${route}`));
  }
}
