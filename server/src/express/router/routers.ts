// Dependencies
import fs from 'fs';
import path from 'path';
import { Application, Router } from 'express';

const getRouter = (routePath: string): Router => {
  // Folder where all the routes are declared and exported
  const routesPath = path.resolve(__dirname, routePath);
  const router = Router();

  fs.readdirSync(routesPath).forEach(async (file) => {
    const { dir, name: routeName } = path.parse(path.resolve(routesPath, file));

    try {
      const { default: route } = await import(path.join(dir, routeName));

      // Add imported route to router
      route(router);
    } catch (err) {
      console.log(
        `Unable to load route '${routeName}' into '${routePath}' router: ${err}`
      );
    }
  });

  return router;
};

const routers = {
  rootRouter: {
    path: '/',
    router: getRouter('root'),
  },
  apiRouter: {
    path: '/api',
    router: getRouter('api'),
  },
};

export default function loadRouters(app: Application): void {
  Object.entries(routers).map(([, { path, router }]) => {
    app.use(path, router);
  });
}
