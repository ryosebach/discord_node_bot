/**
 * discord_node_bot
 *
 * 2019 (c) ryosebach
 */
import * as i18n from 'i18n';

/**
 * 文字列リソース取得（ロケール指定版）
 */
export const textByLocale = (locale: string, phrase: Phrase, args?: Object): string => {
  if (!phrase) {
    return '';
  }

  if (args) {
    return i18n.__mf({ phrase, locale }, args);
  } else {
    return i18n.__({ phrase, locale });
  }
};

export type Phrase =
  'all'
| '';
