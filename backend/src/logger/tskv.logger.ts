import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private escapeValue(value: unknown): string {
    if (value === undefined) {
      return '';
    }

    if (typeof value === 'string') {
      return value
        .replace(/\\/g, '\\\\')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
    }

    return JSON.stringify(value);
  }

  formatMessage(
    level: string,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const fields = {
      level,
      message: this.escapeValue(message),
      optionalParams: this.escapeValue(optionalParams),
    };

    return Object.entries(fields)
      .map(([key, value]) => `${key}=${value}`)
      .join('\t');
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
