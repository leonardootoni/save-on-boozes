import Fastify from 'fastify';
import _Ajv from 'ajv';

const { default: serverConfig } = await import( './schemas/server_config.json', { assert: { type: 'json' } } );

enum Env {
  production = 'production',
  development = 'development',
  test = 'test',
}

interface IConfig {
  port: number,
  logger: boolean,
  logger_level: string,
  db_url: string
}

const config: IConfig = ( () => {
  const opts = {
    port:         process.env.PORT ? Number.parseInt( process.env.PORT, 10 ) : 8000,
    logger:       process.env.LOGGER ? Boolean( process.env.LOGGER ) : true,
    logger_level: process.env.LOGGER_LEVEL ?? 'info',
    db_url:       process.env.LOGGER_LEVEL ?? '',
  };

  const Ajv = _Ajv.default;
  const ajv = new Ajv();
  const validate = ajv.compile( serverConfig );
  if ( !validate( opts ) ) {
    throw Error( 'Invalid Server Config params', { cause: validate.errors  } );
  }

  return opts;
} )();

const envToLogger = {
  [Env.development]: {
    transport: {
      target:  'pino-pretty',
      options: {
        colorize:      true,
        translateTime: "sys:yyyy-mm-dd'T'HH:MM:sso",
        ignore:        'pid,hostname',
      },
    },
  },
  [Env.production]: true,
  [Env.test]:       false,
};

export default async function start() {
  let nodeEnv = process.env.NODE_ENV as Env;
  nodeEnv ??= Env.production;

  if ( !Object.keys( Env ).includes( nodeEnv ) ) {
    nodeEnv = Env.production;
  }

  const fastify = Fastify( {
    logger: envToLogger[nodeEnv],
  } );

  fastify.get( '/', {}, ( request, reply ) => {
    request.log.info( 'Hello fellaD!!!' );
    reply.send( { hello: 'world' } );
  } );

  fastify.listen( { port: config.port }, ( err, address ) => {
    if ( err ) {
      fastify.log.error( err );
      process.exit( 1 );
    }
    fastify.log.info( `Server listening on ${address}` );
  } );
}
