import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format message as TSKV', () => {
    const result = logger.formatMessage('log', 'test message', 'context');

    expect(result).toBe(
      'level=log\tmessage=test message\toptionalParams=["context"]',
    );
  });

  it('should escape tabs and line breaks', () => {
    const result = logger.formatMessage('log', 'hello\tworld\nnext line');

    expect(result).toBe(
      'level=log\tmessage=hello\\tworld\\nnext line\toptionalParams=[]',
    );
  });

  it('should write log message to console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('test message', 'context');

    expect(spy).toHaveBeenCalledWith(
      'level=log\tmessage=test message\toptionalParams=["context"]',
    );
  });

  it('should write error message to console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();

    logger.error('error message', 'trace');

    expect(spy).toHaveBeenCalledWith(
      'level=error\tmessage=error message\toptionalParams=["trace"]',
    );
  });

  it('should write warning message to console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    logger.warn('warning message');

    expect(spy).toHaveBeenCalledWith(
      'level=warn\tmessage=warning message\toptionalParams=[]',
    );
  });
});
