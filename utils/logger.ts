export class Logger {
  private static colors: Record<string, string> = {
    reset: '\x1b[0m',
    info: '\x1b[36m', // Cyan
    log: '\x1b[37m', // White
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    danger: '\x1b[41m\x1b[37m', // White text on Red background
  }

  static log(message: string): void {
    console.log(`${Logger.colors.log}[LOG] ${message}${Logger.colors.reset}`)
  }

  static info(message: string): void {
    console.log(`${Logger.colors.info}[INFO] ${message}${Logger.colors.reset}`)
  }

  static success(message: string): void {
    console.log(`${Logger.colors.success}[SUCCESS] ${message}${Logger.colors.reset}`)
  }

  static warning(message: string): void {
    console.log(`${Logger.colors.warning}[WARNING] ${message}${Logger.colors.reset}`)
  }

  static error(message: string): void {
    console.log(`${Logger.colors.error}[ERROR] ${message}${Logger.colors.reset}`)
  }

  static danger(message: string): void {
    console.log(`${Logger.colors.danger}[DANGER] ${message}${Logger.colors.reset}`)
  }
}
