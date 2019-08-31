const pino = require('pino')
const lodash = require('lodash')

/**
 * A base 'pino' logger instance.
 * @type {pino}
 */
let baseLogger

/**
 * Gets the base 'pino' logger.
 *
 * @returns {pino}
 */
function getBaseLogger () {
  if (baseLogger === undefined) {
    // Set some sensible config defaults
    let loggerConfig = {}
    loggerConfig.level = 'info'
    loggerConfig.prettyPrint = false

    // Base context details
    const baseBindings = {}

    // Try reading app config if available
    try {
      const config = require('config')
      if (config.has('logger')) {
        const localConfig = config.get('logger')
        loggerConfig = lodash.mergeWith(loggerConfig, localConfig)
      }
      if (config.has('appName')) {
        baseBindings._app = config.get('appName')
      }
    } catch (e) {
      // Ignore
    }

    // Overrides from env vars
    const env = process.env
    loggerConfig.level = lodash.get(env, 'MF_LOG_LEVEL', loggerConfig.level)
    loggerConfig.prettyPrint = lodash.get(env, 'MF_LOG_PRETTY', loggerConfig.prettyPrint)
    baseBindings._app = lodash.get(env, 'MF_APPNAME', (baseBindings._app || process.argv[1] || process.pid))

    // Replace the default base bindings
    loggerConfig.base = baseBindings

    // Create the base logger instance
    baseLogger = pino(loggerConfig)
  }

  return baseLogger
}

/**
 * Represents a 'wrapped' logger.
 */
class MfLogger {
  /**
   * @summary Gets a contextual logger instance.
   * @param {string} moduleName the contextual module name.
   * @param {string} classFileName The contextual class or file name.
   *
   * @returns {MfLogger} A logger instance.
   */
  static getContextLogger (moduleName, classFileName) {
    const bindings = {}
    if (moduleName !== undefined) {
      bindings._mod = moduleName
    }
    if (classFileName !== undefined) {
      bindings._cls = classFileName
    }

    const baseLogger = getBaseLogger()

    return new MfLogger(baseLogger.child(bindings))
  }

  /**
   * @summary Create a new instance by wrapping a pino logger.
   * @description Do no create an instance directly, use the convenience method {@link getContextLogger} instead.
   * Or use the {@link getChildLogger} to get a child instance.
   *
   * @param {pino} pinoLogger The 'pino' logger instance to wrap.
   */
  constructor (pinoLogger) {
    this.coreLogger = pinoLogger
  }

  /**
   * Logs a fatal level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  fatal (...args) {
    this.coreLogger.fatal(...args)
  }

  /**
   * Logs a fatal level message in a function context.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {String} functionName The contextual function name.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  fatalF (functionName, ...args) {
    this.coreLogger.child({ _fun: functionName }).fatal(...args)
  }

  /**
   * Logs an error level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  error (...args) {
    this.coreLogger.error(...args)
  }

  /**
   * Logs a error level message in a function context.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {String} functionName The contextual function name.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  errorF (functionName, ...args) {
    this.coreLogger.child({ _fun: functionName }).error(...args)
  }

  /**
   * Logs a warning level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  warn (...args) {
    this.coreLogger.warn(...args)
  }

  /**
   * Logs a warn level message in a function context.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {String} functionName The contextual function name.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  warnF (functionName, ...args) {
    this.coreLogger.child({ _fun: functionName }).warn(...args)
  }

  /**
   * Logs an informational level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  info (...args) {
    this.coreLogger.info(...args)
  }

  /**
   * Logs a info level message in a function context.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {String} functionName The contextual function name.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  infoF (functionName, ...args) {
    this.coreLogger.child({ _fun: functionName }).info(...args)
  }

  /**
   * Logs a debug level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  debug (...args) {
    this.coreLogger.debug(...args)
  }

  /**
   * Logs a debug level message in a function context.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {String} functionName The contextual function name.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  debugF (functionName, ...args) {
    this.coreLogger.child({ _fun: functionName }).debug(...args)
  }

  /**
   * Logs a trace level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  trace (...args) {
    this.coreLogger.trace(...args)
  }

  /**
   * Logs a trace level message in a function context.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {String} functionName The contextual function name.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  traceF (functionName, ...args) {
    this.coreLogger.child({ _fun: functionName }).trace(...args)
  }

  /**
   * Logs an 'Event'.
   * This is output at the 'info' level.
   * The event name is logged under the '_event' key.
   *
   * @param {string} eventName the event name
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  event (eventName, ...args) {
    this.coreLogger.child({ _event: eventName }).info(...args)
  }

  /**
   * Logs an 'Event' in a function context.
   * This is output at the 'info' level.
   * The event name is logged under the '_event' key.
   *
   * @param {String} functionName The contextual function name.
   * @param {string} eventName the event name.
   * @param {...any} args Log arguments - (object, message?, ...any) or (error, message?, ...any) or (message, ...any)
   */
  eventF (functionName, eventName, ...args) {
    this.coreLogger.child({ _fun: functionName, _event: eventName }).info(...args)
  }

  /**
   * Logs an entry at 'error' level if the assertion fails (check is falsy).
   *
   * @param {any} check A value which is tested for a falsy value.
   * @param {string=} message Optional message.
   * @param {...any} args Additional arguments or message placeholder values.
   */
  assert (check, message, ...args) {
    if (check) {
      return false
    }

    if (message === undefined) {
      this.error(new Error('Assertion failed!'))
    } else {
      this.error(new Error('Assertion failed!'), message, ...args)
    }
  }

  /**
   * Get the underlying core logger instance.
   *
   * @returns {pino} the 'pino' instance.
   */
  getCoreLogger () {
    return this.coreLogger
  }

  /**
   * @summary Gets a child logger.
   * @description Gets a child logger that inherits the properties and context of this logger and adds in properties from the supplied childContext.
   * @param {any} childContext An object containing the child context properties.
   */
  getChildLogger (childContext) {
    const childPino = this.coreLogger.child(childContext)

    return new MfLogger(childPino)
  }
}

module.exports = MfLogger
