/**
 * A translation associates ONE language to ONE string (written in this language)
 */
export class Translation {
  lang: string;
  string: string;

  constructor(lang: string, string: string) {
    this.lang = lang;
    this.string = string;
  }
}