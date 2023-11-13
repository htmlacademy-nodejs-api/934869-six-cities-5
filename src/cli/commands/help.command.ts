import chalk from 'chalk';

import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.blue(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            cli.js --<command> [--arguments]
        Команды:
            --version:                   # выводит номер версии приложения
            --help:                      # печатает возможные команды cli приложения
            --import:                    # импортирует данные из TSV, параметры:
              <path> - путь до TSV файла
              <login> - логин,
              <password> - пароль,
              <host> - хост на котором запущена MongoDB,
              <dbname> - название базы данных,
              <salt> - секретный ключ (необходим для хеширования паролей)
            --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных
              <n> - количество генерируемых записей
              <path> - полный путь, с указанием файла, по которому сохраняются генерируемые данные
              <url> - url адрес мокового json-сервера (npm run start:mock-server)
    `));
  }
}
