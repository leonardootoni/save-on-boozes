import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { Provider } from '../common/constants.js';
import facade from '../services/facade.js';

// define plugin using promises
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }>( '/extract/:provider', {
    schema: {
      params: { $ref: 'getExtractProvider#' },
    },

  }, async ( request, reply ) => {
    const { provider } = request.params;
    request.log.info( `called provider: ${provider}` );
    const data = await facade.ExecuteParser.BSWParser();

    const test = await fastify?.mongo?.db?.collection( 'liquor' ).find( {} ).toArray();
    await fastify?.mongo?.db?.collection( 'liquor' ).insertOne( { name: 'Miriam' } );

    reply.send( { code: 200, data: `from facade ${data}` } );
  } );
};


export default fp(
  async app => { app.register( plugin, { prefix: '/v1' } ); },
  {
    fastify: '4.x',
    name:    'Url Parsers',
  },
);


