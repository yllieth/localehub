import { Language } from './';

/**
 * A translation associates ONE language to ONE string (written in this language)
 */
export class Translation {
  language: Language;
  string: string;
  editedString: string;
  isPending: boolean;

  constructor(language: Language, string: string, isPending?: boolean) {
    this.language = language;
    this.isPending = isPending;

    if (isPending === true) {
      // add a new locale
      this.string = null;
      this.editedString = string;
    } else {
      // define an existing locale
      this.string = string;
      this.editedString = null;
    }
  }
}