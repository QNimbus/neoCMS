// Dependencies
import Express from 'express';

// Express route to check server status
export default (app: Express.Router) => {
  app.use('/ping', (_req: Express.Request, res: Express.Response) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.status(200).json('{ ping: true}');
  });
};
