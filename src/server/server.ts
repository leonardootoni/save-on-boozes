import Fastify from 'fastify';
import _Ajv from 'ajv';
import mongodb from '@fastify/mongodb';
import parsers from '../apis/parsers.js';
import { ENV } from '../common/constants.js';
import getAppLoggerConfig from '../services/logger.js';


const { default: serverConfig } = await import( './server_config.json', { assert: { type: 'json' } } );

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


export default async function start() {
  let nodeEnv = process.env.NODE_ENV;
  nodeEnv ??= ENV.PRODUCTION;

  if ( Object.values( ENV ).every( v => v.toString() !== nodeEnv ) ) {
    nodeEnv = ENV.PRODUCTION;
  }

  const fastify = Fastify( {
    logger: await getAppLoggerConfig( nodeEnv as ENV ),
  } );

  fastify.register( mongodb, {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url:        process.env.DB_URL,
  } );

  fastify.register( parsers );

  fastify.listen( { port: config.port }, ( err, address ) => {
    if ( err ) {
      fastify.log.error( err );
      process.exit( 1 );
    }
    fastify.log.info( `Server listening on ${address}` );
  } );
}
