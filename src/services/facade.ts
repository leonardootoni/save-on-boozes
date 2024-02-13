import BSWParser from '../modules/BSWParser.js';

const appFacade = Object.freeze( {
  ExecuteParser: Object.freeze( {
    BSWParser,
  } ),
} );

Object.preventExtensions( appFacade );
Object.preventExtensions( appFacade.ExecuteParser );

export default appFacade;
