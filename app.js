'use strict';

// Import Configuration
const CONFIG = require( './config.js' );

// Import Libraries
const APP = require( 'express' )( ); // Web Framework
const BODYPARSER = require( 'body-parser' ); // Web Framework Helper
const CRYPTOJS = require( 'crypto-js' ); // JWT Framework

// Configure Express
const PORT = CONFIG.PORT;
APP.use( BODYPARSER.json( ) );

function generateBase64URL ( p )
{
  // Encode in classical base64
  let o = CRYPTOJS.enc.Base64.stringify( p );

  // Remove padding equal characters
  o = o.replace(/=+$/, '');

  // Replace characters according to base64url specifications
  o = o.replace(/\+/g, '-');
  o = o.replace(/\//g, '_');

  return o;
}

function generateJWT ( p )
{
  let o;

  // Header Configure
  let h = p.h;
  h = CRYPTOJS.enc.Utf8.parse( JSON.stringify( h ) );
  h = generateBase64URL( h );

  // Data Configure
  let d = p.d;
  d = CRYPTOJS.enc.Utf8.parse( JSON.stringify( d ) );
  d = generateBase64URL( d );

  // Combine Header and Data
  o = h + "." + d;

  // Secret Configure
  let s = p.s;
  s = CRYPTOJS.enc.Base64.parse( s );
  s = CRYPTOJS.HmacSHA256( o, s );
  s = generateBase64URL( s )

  // Generate Signed Token
  o = o + "." + s;

  return o;
}

APP.post( CONFIG.ROUTE, ( req, res ) => { // Endpoint to Receive JWT Token Generation Requests
  //console.log( req );
  //console.log( `[${new Date( ).toISOString( )}] URL: /jwt/generate; HEADER: ${req.header}; BODY: ${req.body};` );
  let r;

  try
  {
    r = generateJWT( {
      "h":req.body.headers,
      "d":req.body.data,
      "s":req.body.secret
    } );
    res.send( { "jwt":r } );
  }
  catch ( e )
  {
    console.log( e );
    res.sendStatus( 400 );
  }
} );

APP.get( '/jwt/generate', ( req, res ) => {
  res.sendStatus( 200 );
} )

APP.listen( PORT );
