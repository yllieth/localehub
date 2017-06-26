import { Language, LocaleUpdate } from './';
import { LanguageService } from '../+services';

/**
 * A translation associates ONE language to ONE string (written in this language)
 */
export class Translation {
  language: Language;
  string: string;
  editedString: string;
  isPending: boolean;
  $metadata?: any = {};

  static createFromLocaleUpdate(change: LocaleUpdate): Translation {
    let translation = new Translation(LanguageService.find(change.languageCode), '', change.value.newString !== undefined);
    translation.string = change.value.newString;
    translation.editedString = change.value.oldString;

    return translation;
  }

  constructor(language: Language, string: string, isPending?: boolean) {
    this.language = language;
    this.isPending = isPending;

    if (isPending === true) {
      // add a new locale
      this.string = undefined;  // must be undefined to match the output of deepGetter function in the commit lambda (see projects-commit::apply())
      this.editedString = string;
    } else {
      // define an existing locale
      this.string = string;
      this.editedString = null;
    }
  }
}