# Cisco Spark JWT Generation Server

This tool is used to launch an express web server that is designed to receive HTTP POST requests, then respond with a JWT for the usage of GuestID users in Cisco Spark.

### Usage

First, confirm that the settings are accurate for how you'd like to run the server. To do this, review `./config.js`.

```javascript
'use strict';

module.exports =
{
  "PORT": 8080, // Port the express server will run on
  "ROUTE": "/" // The route your server will listen on. i.e. '127.0.0.1' + ROUTE
};
```

Next, you will need to initialize the application by running `npm start` while in the project's directory. This will start the server.

Finally, you can now send HTTP POST requests to the server, and it will respond with a usable JWT for Cisco Spark GuestID. An example request process below:

**HEADER**
```json
{ }
```

**BODY**
```json
{
  "headers":{
  	"alg": "HS256",
  	"typ": "JWT"
  },
  "data":{
    "sub": "GuestUserName",
    "name": "Guest User's Display Name",
    "iss": "GuestApplicationID"
  },
  "secret": "GuestApplicationSecret"
}
```

**RESPONSE**
```json
{
	"jwt": "MYJWT"
}
```

### Additiional Notes

Logging into a GuestID user can be done via the following request:

**URL**
https://api.ciscospark.com/v1/jwt/login

**METHOD**
POST

**HEADER**
```json
{
  "Content-type": "application/json",
  "Authorization": "Bearer ${MYJWT}"
}
```

**BODY**
```json
{ }
```

### External References

[Cisco Spark Developer Portal for GuestID](https://developer.ciscospark.com/guest-issuer.html)
