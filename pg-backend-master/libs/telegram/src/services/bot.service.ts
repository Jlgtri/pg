import TelegramBot, {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
} from 'node-telegram-bot-api';

export class BotTelegramService {
  bot: TelegramBot;

  initBot(botToken: string) {
    this.bot = new TelegramBot(botToken, { polling: true });
  }

  async sendMessage(
    chatId: number,
    text: string,
    parseMode: TelegramBot.ParseMode,
    inlineKeyboardMarkup?: InlineKeyboardMarkup | ReplyKeyboardMarkup,
  ) {
    await this.bot.sendMessage(chatId, text, {
      parse_mode: parseMode,
      reply_markup: inlineKeyboardMarkup,
    });
  }

  onText(
    commandRegExp: RegExp,
    callback: (msg: TelegramBot.Message, match: RegExpExecArray | null) => void,
  ) {
    this.bot.onText(commandRegExp, (msg, match) => callback(msg, match));
  }
}
