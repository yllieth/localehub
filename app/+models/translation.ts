import { Language } from './';

/**
 * A translation associates ONE language to ONE string (written in this language)
 */
export class Translation {
  language: Language;
  string: string;
  editedString: string;   // used by the view

  constructor(language: Language, string: string) {
    this.language = language;
    this.string = string;
    this.editedString = null;
  }
}