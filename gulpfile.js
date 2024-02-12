/**
 * Afflo Services Application Builder Toolkit
 *
 * Pre requisites:
 *  npm install --global gulp-cli
 *  npm install --save-dev gulp
 *
 *  Workaround for missing obfuscator dependencies (need to be revisited with newer versions and likely obsolete):
 *    npm install --save-dev vinyl-sourcemaps-apply
 *
 * General intructions for execution:
 *  - check npm build job in the project's package.json
 *  - type gulp <task name> at the project's root folder
 *
 * It replaces npx javascript-obfuscator ./src --config obfuscator.json --output ./obfuscated/src --target node
 *
 * @copyright Shore Consulting
 */
const {
  src, dest, series, parallel,
}                   = require( "gulp" );
const run           = require( "gulp-run" );
const uglify        = require( "gulp-uglify" );
const jsObfuscator  = require( "gulp-javascript-obfuscator" );

const {
  rm, mkdir, readFile, writeFile,
}                   = require( "node:fs/promises" );

const APPLICATION_DIR = "./src";
const BUILD_DIR = "./built";

/**
 * Be careful before any on change here!!!
 * This is the default obfuscation level. High obfuscation level equals to low performance.
 *
 * More here:
 * https://github.com/javascript-obfuscator/javascript-obfuscator#low-obfuscation-high-performance
 */
// const CUSTOM_OBFUSCATOR_OPTS = {
//   target:                                'node',
//   compact:                               true,
//   deadCodeInjection:                     true, //
//   deadCodeInjectionThreshold:            0.4, //
//   controlFlowFlattening:                 false,
//   debugProtection:                       false,
//   debugProtectionInterval:               0,
//   disableConsoleOutput:                  true, //
//   identifierNamesGenerator:              'hexadecimal',
//   log:                                   false,
//   numbersToExpressions:                  true, //
//   renameGlobals:                         false,
//   selfDefending:                         true,
//   simplify:                              true,
//   splitStrings:                          false,
//   stringArray:                           true,
//   stringArrayCallsTransform:             false,
//   stringArrayCallsTransformThreshold:    0.5,
//   stringArrayEncoding:                   [], //
//   stringArrayIndexShift:                 true,
//   stringArrayRotate:                     true,
//   stringArrayShuffle:                    true,
//   stringArrayWrappersCount:              1,
//   stringArrayWrappersChainedCalls:       true,
//   stringArrayWrappersParametersMaxCount: 2,
//   stringArrayWrappersType:               'function',
//   stringArrayThreshold:                  0.25,
//   transformObjectKeys:                   false, //
//   unicodeEscapeSequence:                 false,
// };

const LOW_OBFUSCATOR_HIGH_PERFORMANCE_OPTS = {
  target:                                'node',
  compact:                               true,
  controlFlowFlattening:                 false,
  deadCodeInjection:                     false,
  debugProtection:                       false,
  debugProtectionInterval:               0,
  disableConsoleOutput:                  true,
  identifierNamesGenerator:              'hexadecimal',
  log:                                   false,
  numbersToExpressions:                  false,
  renameGlobals:                         false,
  selfDefending:                         true,
  simplify:                              true,
  splitStrings:                          false,
  stringArray:                           true,
  stringArrayCallsTransform:             false,
  stringArrayEncoding:                   [],
  stringArrayIndexShift:                 true,
  stringArrayRotate:                     true,
  stringArrayShuffle:                    true,
  stringArrayWrappersCount:              1,
  stringArrayWrappersChainedCalls:       true,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType:               'variable',
  stringArrayThreshold:                  0.75,
  unicodeEscapeSequence:                 false,
};

function cleanUpBuildDir() {
  return rm( BUILD_DIR, { force: true, recursive: true } )
    .then( () => mkdir( BUILD_DIR ) );
}

function copySourceCode() {
  return src( `${APPLICATION_DIR}/**` )
    .pipe( dest( `${BUILD_DIR}/src` ) );
}

function uglifySourceCode() {
  return src( `${BUILD_DIR}/src/**` )
    .pipe( uglify( { v8: true } ) )
    .pipe( dest( `${BUILD_DIR}/src` ) );
}

function obfuscateSourceCode() {
  return src( `${BUILD_DIR}/src/**` )
    .pipe( jsObfuscator( LOW_OBFUSCATOR_HIGH_PERFORMANCE_OPTS ) )
    .pipe( dest( `${BUILD_DIR}/src` ) );
}

/**
 * Necessary overriding step since js-obfuscator does not ignore JSON files...
 */
function copyVFNSFile( client ) {
  const CLIENT = client;
  return src( `${APPLICATION_DIR}/modules/versioned_functions/client/${CLIENT}/required_versioned_functions.json` )
    .pipe( dest( `${BUILD_DIR}/src/modules/versioned_functions/client/${CLIENT}/` ) );
}

function copyVFNSListFiles() {
  return Promise.all( [ copyVFNSFile( "TGLN" ), copyVFNSFile( "TQ" ) ] );
}

function prepareProdPackageJSON() {
  return readFile( "./package.json", { encoding: "utf8" } )
    .then( file => {
      const json = JSON.parse( file );
      delete json.devDependencies;

      for( const command of Object.keys( json.scripts ) ) {
        if( ![ "start", "start.prod" ].includes( command ) ) {
          delete json.scripts[ command ];
        }
      }

      const data = JSON.stringify( json, null, 2 );
      return writeFile( `${BUILD_DIR}/package.json`, data );
    } );
}

function installProdDependencies() {
  return run( "npm install --omit=dev", { cwd: BUILD_DIR, verbosity: 3 } )
    .exec();
}

module.exports = {
  createProductionBuild: series(
    cleanUpBuildDir,
    copySourceCode,
    uglifySourceCode,
    obfuscateSourceCode,
    copyVFNSListFiles,
    prepareProdPackageJSON,
    installProdDependencies,
  ),
};
