import chalk from 'chalk'

export function debug(name: string, ...args: any[]) {
  console.debug(chalk.grey(name), ...args)
}

export function success(text: string, ...args: any[]) {
  console.info(chalk.green(chalk.bold(text)), ...args)
}

export function wtf(text: string, ...args: any[]) {
  console.error(chalk.red(chalk.bold(`[🔥] ${text}`)), ...args)
}

export function info(text: string, ...args: any[]) {
  console.info(chalk.blue(chalk.bold(`[🤔] ${text}`)), ...args)
}