import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format message as JSON', () => {
    const result = logger.formatMessage('log', 'test message', 'context');

    expect(result).toBe(
      JSON.stringify({
        level: 'log',
        message: 'test message',
        optionalParams: ['context'],
      }),
    );
  });

  it('should write log message to console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('test message', 'context');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'log',
        message: 'test message',
        optionalParams: ['context'],
      }),
    );
  });

  it('should write error message to console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();

    logger.error('error message', 'trace');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'error',
        message: 'error message',
        optionalParams: ['trace'],
      }),
    );
  });

  it('should write warning message to console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    logger.warn('warning message');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'warn',
        message: 'warning message',
        optionalParams: [],
      }),
    );
  });
});
