import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const plugin: FastifyPluginAsync = async ( fastify: FastifyInstance ) => {
  await fastify.register( fastifySwagger, {
    swagger: {
      info: {
        title:       'Swagger',
        description: 'Fastify swagger API',
        version:     '0.1.0',
      },
      // externalDocs: {
      //   url:         'https://swagger.io',
      //   description: 'Find more info here',
      // },
      // host:     'localhost',
      schemes:  [ 'http' ],
      consumes: [ 'application/json' ],
      produces: [ 'application/json' ],
      tags:     [
        { name: 'code', description: 'Code related end-points' },
      ],
      definitions: {
        // User: {
        //   type:       'object',
        //   required:   [ 'id', 'email' ],
        //   properties: {
        //     id:        { type: 'string', format: 'uuid' },
        //     firstName: { type: 'string' },
        //     lastName:  { type: 'string' },
        //     email:     { type: 'string', format: 'email' },
        //   },
        // },
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in:   'header',
        },
      },
    },
  } );

  await fastify.register( fastifySwaggerUi, {
    // routePrefix: '/docs',
    // uiConfig:    {
    //   docExpansion: 'full',
    //   deepLinking:  false,
    // },
    uiHooks: {
      onRequest( _request, _reply, next ) {
        next();
      },
      preHandler( _request, _reply, next ) {
        next();
      },
    },
    staticCSP:                   true,
    transformStaticCSP:          header => header,
    transformSpecification:      swaggerObject => swaggerObject,
    transformSpecificationClone: true,
  } );
};

// export default plugin;

export default fp( plugin );
