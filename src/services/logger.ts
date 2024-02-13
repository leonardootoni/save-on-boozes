/**
 * Default App Logger Config
 */
import { ENV } from '../common/constants.js';

export default async function getAppLoggerConfig( env: ENV ) {
  const envToLogger = {
    [ENV.DEVELOPMENT]: {
      transport: {
        target:  'pino-pretty',
        options: {
          colorize:      true,
          translateTime: "sys:yyyy-mm-dd'T'HH:MM:sso",
          ignore:        'pid,hostname',
        },
      },
    },
    [ENV.PRODUCTION]: true,
    [ENV.TEST]:       false,
  };

  return envToLogger[env];
}
