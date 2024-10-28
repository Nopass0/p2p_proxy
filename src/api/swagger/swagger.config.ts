export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'P2P Exchange API',
    version: '1.0.0',
    description: 'API документация для P2P обменника',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API версии 1',
    },
  ],
  components: {
    schemas: {
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          amount: { type: 'number' },
          currency: { type: 'string' },
          status: { 
            type: 'string',
            enum: ['pending', 'accepted', 'completed', 'failed']
          },
          paymentMethod: { type: 'string' },
          userId: { type: 'string', format: 'uuid' },
          expiresAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTransaction: {
        type: 'object',
        required: ['amount', 'currency', 'paymentMethod'],
        properties: {
          amount: { type: 'number' },
          currency: { type: 'string' },
          paymentMethod: { type: 'string' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/transactions': {
      post: {
        tags: ['Транзакции'],
        summary: 'Создать новую транзакцию',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateTransaction',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Транзакция создана',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Transaction',
                },
              },
            },
          },
        },
      },
    },
  },
};