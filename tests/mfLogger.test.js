/* eslint-env jest */
const stream = require('stream')
const pino = require('pino')
const MfLogger = require('../index')

let pinoOutJson
const w = new stream.Writable({
  write (chunk, encoding, callback) {
    const chunkString = chunk.toString()
    try {
      pinoOutJson = JSON.parse(chunkString)
    } catch (e) {
      pinoOutJson = {}
    }

    // console.log('Log Output:', chunkString)

    callback()
  }
})

function clearOutput () {
  pinoOutJson = undefined
}

const ctxLogger = MfLogger.getContextLogger('test')

// Hack the output stream so that we can verify the logged data
const coreLogger = ctxLogger.getCoreLogger()
coreLogger[pino.symbols.streamSym] = w

test('Test fatal log with (string)', () => {
  clearOutput()

  const message = 'This is a fatal message'
  ctxLogger.fatal(message)
  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['fatal'])
  expect(pinoOutJson).toHaveProperty('msg', message)
})

test('Test fatal log with (string, params)', () => {
  const message = 'This is a fatal message with param1 = %s, param2 = %d'
  const param1 = 'param1'
  const param2 = 100
  const expectedMessage = `This is a fatal message with param1 = ${param1}, param2 = ${param2}`

  ctxLogger.fatal(message, param1, param2)

  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['fatal'])
  expect(pinoOutJson).toHaveProperty('msg', expectedMessage)
})

test('Test fatal log with (string, any)', () => {
  clearOutput()

  const message = 'This is a fatal message with no params'
  const param1 = 'param1'
  const param2 = { value: 100 }
  const expectedMessage = `This is a fatal message with no params ${param1} {"value":${param2.value}}`

  ctxLogger.fatal(message, param1, param2)

  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['fatal'])
  expect(pinoOutJson).toHaveProperty('msg', expectedMessage)
})

test('Test fatal log with (object)', () => {
  clearOutput()

  const payload = { fatal: 'This is fatal!' }
  ctxLogger.fatal(payload)
  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['fatal'])
  expect(pinoOutJson).toMatchObject(payload)
})

test('Test fatal log with (object, string, params)', () => {
  clearOutput()

  const payload = { fatal: 'This is fatal!' }
  const message = 'This is a fatal message with param1 = %s, param2 = %d'
  const param1 = 'param1'
  const param2 = 100
  const expectedMessage = `This is a fatal message with param1 = ${param1}, param2 = ${param2}`

  ctxLogger.fatal(payload, message, param1, param2)

  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['fatal'])
  expect(pinoOutJson).toMatchObject(payload)
  expect(pinoOutJson).toHaveProperty('msg', expectedMessage)
})

test('Test fatal log with (object, string, any)', () => {
  clearOutput()

  const payload = { fatal: 'This is fatal!' }
  const message = 'This is a fatal message with no params'
  const param1 = 'param1'
  const param2 = { value: 100 }
  const expectedMessage = `This is a fatal message with no params ${param1} {"value":${param2.value}}`

  ctxLogger.fatal(payload, message, param1, param2)

  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['fatal'])
  expect(pinoOutJson).toMatchObject(payload)
  expect(pinoOutJson).toHaveProperty('msg', expectedMessage)
})

test('Test fatal log with (Error)', () => {
  clearOutput()

  const payload = new Error('This is fatal Error!')
  ctxLogger.fatal(payload)
  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['fatal'])
  expect(pinoOutJson).toHaveProperty('type', 'Error')
  expect(pinoOutJson).toHaveProperty('msg', payload.message)
})

test('Test fatal log with (Error, string)', () => {
  clearOutput()

  const payload = new Error('This is fatal Error!')
  const message = 'This is a fatal message'
  ctxLogger.fatal(payload, message)
  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['fatal'])
  expect(pinoOutJson).toHaveProperty('type', 'Error')
  expect(pinoOutJson).toHaveProperty('msg', message)
})

test('Test fatal log with (Error, string, params)', () => {
  clearOutput()

  const payload = new Error('This is fatal Error!')
  const message = 'This is a fatal message with param1 = %s, param2 = %d'
  const param1 = 'param1'
  const param2 = 100
  const expectedMessage = `This is a fatal message with param1 = ${param1}, param2 = ${param2}`

  ctxLogger.fatal(payload, message, param1, param2)

  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['fatal'])
  expect(pinoOutJson).toHaveProperty('type', 'Error')
  expect(pinoOutJson).toHaveProperty('msg', expectedMessage)
})

test('Test fatal log in function context with (string)', () => {
  clearOutput()

  const message = 'This is fatal in a function message'
  function fatalFn () {
    ctxLogger.fatalF('fatalFn', message)
  }
  fatalFn()
  expect(pinoOutJson).toHaveProperty('_fun', 'fatalFn')
  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['fatal'])
  expect(pinoOutJson).toHaveProperty('msg', message)
})

test('Test error log with (string)', () => {
  clearOutput()

  const message = 'This is an error message'
  ctxLogger.error(message)
  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['error'])
  expect(pinoOutJson).toHaveProperty('msg', message)
})

test('Test info log with (string)', () => {
  clearOutput()

  const message = 'This is an info message'
  ctxLogger.info(message)
  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['info'])
  expect(pinoOutJson).toHaveProperty('msg', message)
})

test('Test debug log with (string), should not log!', () => {
  clearOutput()

  const message = 'This is an debug message'
  ctxLogger.debug(message)
  expect(pinoOutJson).toBeUndefined()
})

test('Test debug log with (string) on a child logger', () => {
  clearOutput()

  const childProperties = { prop1: 'property 1' }
  const childLogger = ctxLogger.getChildLogger(Object.assign({ level: 'debug' }, childProperties))
  const message = 'This is an debug message'
  childLogger.debug(message)
  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['debug'])
  expect(pinoOutJson).toMatchObject(childProperties)
  expect(pinoOutJson).toHaveProperty('msg', message)
})

test('Test trace log with (string) on a child logger', () => {
  clearOutput()

  const childLogger = ctxLogger.getChildLogger({ level: 'trace', child: 'child' })
  const message = 'This is an trace message'
  childLogger.trace(message)
  expect(pinoOutJson).toHaveProperty('child', 'child')
  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['trace'])
  expect(pinoOutJson).toHaveProperty('msg', message)
})

test('Test event log', () => {
  clearOutput()

  const eventName = 'EVENT_TEST'
  const message = 'This is an event log message'
  ctxLogger.event(eventName, message)
  expect(pinoOutJson).toHaveProperty('level', pino.levels.values['info'])
  expect(pinoOutJson).toHaveProperty('_event', eventName)
  expect(pinoOutJson).toHaveProperty('msg', message)
})
