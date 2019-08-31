# mf-logger
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A wrapper over [pino](https://github.com/pinojs/pino) logger.

## Installation
```
npm install mobifiliallp/mf-logger.git
```

## Configuration
The log level and style can be configured by setting the following environment variables.

| Env Var | Notes | Default |
|---|---|---|
MF_LOG_LEVEL | Should be a valid log level string | `info` |
MF_LOG_PRETTY | Set to `true` to enable pretty output | *Undefined* |
MF_APPNAME | Set to a string that will be logged under the _app key. You can use this to identify the running application | `(process.argv[1] || process.pid)`

The underlying `pino` instance can be accessed by calling `getCoreLogger()` on the wrapper. You can directly configure it by referring the pino documentation.

## Usage
```js
const MfLogger = require('mf-logger');

// To get the default logger (for this module)
const logger = MfLogger.getContextLogger();

// To get contextual loggers
const loggerM = MfLogger.getContextLogger('test-module')
const loggerC = MfLogger.getContextLogger('test-module', 'TestClass')

logger.info('This is an info log')
loggerM.warn('This is a warning in test-module')
loggerC.error('Oh Oh - An error!')
```
Output:
```JSON
{"level":30,"time":1531171074631,"msg":"This is an info log","pid":657,"hostname":"localhost","v":1}
{"level":40,"time":1531171102399,"_mod":"test-module","msg":"This is a warning in test-module","pid":657,"hostname":"localhost","a":"property","v":1}
{"level":50,"time":1531171182399,"_mod":"test-module","_cls":"TestClass","msg":"Oh Oh - An error!","pid":657,"hostname":"localhost","a":"property","v":1}
```
