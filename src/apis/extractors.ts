import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { Provider } from '../common/constants.js';
import facade from '../services/facade.js';

interface IExtractionHandler {
  Querystring: {
    name: string,
    excitement: number
  },
  Params: {
    provider: string
  }
}

/**
 * Constrollers implementation
 */
async function extractionHandler( request: FastifyRequest<IExtractionHandler>, reply: FastifyReply ) {
  // return reply.send( { bla: 'world' } );
  return reply.notFound( 'dsfdsfsdfs bla bla bla' );
}

/**
 * Routes Registry
 *
 * @param fastify
 */
const plugin: FastifyPluginAsync = async ( fastify: FastifyInstance ) => {
  fastify.addSchema( {
    $id:        'getExtractProvider',
    type:       'object',
    properties: {
      provider: {
        type: 'string',
        enum: [ Provider.BSW, Provider.ZYN, Provider.CROWN_CELLAR ],
      },
    },
    required: [ 'provider' ],
  } );

  fastify.get<{
    Params: { provider: string }
  }>( '/extraction/:provider', {
    schema: {
      params: { $ref: 'getExtractProvider#' },
    },

  }, async ( request, reply ) => {
    const { provider } = request.params;
    request.log.info( `called provider: ${provider}` );
    const data = await facade.ExecuteParser.BSWParser();

    // const test = await fastify?.mongo?.db?.collection( 'liquor' ).find( {} ).toArray();
    await fastify?.mongo?.db?.collection( 'liquor' ).insertOne( { name: 'Miriam' } );

    reply.send( { code: 200, data: `from facade ${data}` } );
  } );


  fastify.route<{
    Querystring: {
      name: string,
      excitement: number
    },
    Params: {
      provider: string
    }
  }>( {
    method: 'post',
    url:    '/extraction/:provider',
    schema: {
      description: 'Extract data from a remote provider',
      tags:        [ 'code' ],
      summary:     'qwerty',
      querystring: {
        name:       { type: 'string' },
        excitement: { type: 'integer' },
      },
      params: { $ref: 'getExtractProvider#' },
      // response: {
      //   200: {
      //     type:       'object',
      //     properties: {
      //       hello: { type: 'string' },
      //     },
      //   },
      // },
    },
    // async handler( request, reply ) {
    //   reply.send( { hello: 'world' } );
    // },
    handler: extractionHandler,
  } );
};


export default fp(
  async app => { app.register( plugin, { prefix: '/v1' } ); },
  {
    fastify: '4.x',
    name:    'Url Parsers',
  },
);


