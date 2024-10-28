import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger.config';

export function setupSwagger(router: Router) {
  router.use('/docs', swaggerUi.serve);
  router.get('/docs', swaggerUi.setup(swaggerDocument));
}