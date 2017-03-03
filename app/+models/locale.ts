import { Language, Translation } from './';

export class Locale {
  key: string;            // ex: subtitle
  keyPath: string;        // ex: pages.about
  values: Translation[];  // ex: {language: 'fr', string: '%{brand} est fait par des <span>humains</span>', editedString: null, isPending: false}
  missing: Language[];    // ex: {languageName: '', languageCode: '', flagClass: ''}
  expanded: boolean;      // ex: true

  /**
   * A locale associates an i18n key with one (or more) translation(s).
   *
   * @param key               The complete json path delimited by '.' - Ex: pages.about.subtitle
   * @param value
   * @param currentLanguage   The language object corresponding to init value
   * @param languages         The list of supported languages
   */
  constructor(key: string, value: string, currentLanguage: Language, languages: Language[]) {
    let keyParts = key.split('.');
    if (this.values === undefined) { this.values = [] }

    this.key = keyParts.pop();
    this.keyPath = keyParts.join('.');
    this.expanded = false;

    if (value !== null && currentLanguage !== null && languages.length > 0) {
      this.addTranslation(currentLanguage, value, languages);
    } else {
      this.missing = languages;   // creates an empty locale
    }
  }

  getValues(): Translation[] {
    return this.values;
  }

  /**
   * Adds a new entry in the values array and updates list of missing translations
   *
   * @param language            - The language of the added translation
   * @param string              - The translation to add
   * @param supportedLanguages  - The list of supported languages (required to update the list of missing translations)
   */
  addTranslation(language: Language, string: string, supportedLanguages: Language[]) {
    let translation = new Translation(language, string);

    this.values.push(translation);
    this.missing = supportedLanguages.filter((lang: Language) => lang != language);
  }

  hasMissingTranslations(): boolean {
    return this.missing.length > 0;
  }

  getMissingTranslations(): Language[] {
    return this.missing;
  }

  expand(state?: boolean): Locale {
    this.expanded = (state === undefined) ? !this.expanded : state;
    return this;
  }

  toggle(): Locale {
    return this.expand();
  }

  getCompleteKey(): string {
    return (this.keyPath)
      ? this.keyPath + '.' + this.key
      : this.key;
  }

  /**
   * Merge two sets of locales (from different languages).
   *
   * While iterating over the locales of the SRC param search for a locale in the DEST which has the same key,
   * - if you find one: add all existing values from the SRC to the DEST and remove the added languge from the missing array
   * - if you don't find one: create a new locale in the DEST
   *
   * @param src
   * @param dest
   */
  static merge(src: Locale[], dest: Locale[]) {
    for (let locale of src) {
      let searchedKey = locale.key;
      let found: Locale[] = dest.filter((candidate: Locale) => {
        return candidate.key === searchedKey;
      });

      if (found.length === 0) {
        dest.push(locale);
      } else if (found.length === 1) {
        for (let translation of locale.values) {
          found[0].values.push(translation);
          found[0].missing = found[0].missing.filter(language => language.languageCode != translation.language.languageCode)
        }
      } else {
        console.error('Internal error: the key ' + searchedKey + ' has been found ' + found.length + ' times. The input file is errored.')
      }
    }
  }
}