import { Language, Translation } from './';
import {LocaleUpdate} from "./localeUpdate";

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
    if (this.values === undefined) { this.values = [] }

    this.setKey(key);
    this.expanded = false;

    if (value !== null && currentLanguage !== null && languages.length > 0) {
      this.addTranslation(currentLanguage, value, languages, false);
    } else {
      this.missing = languages;   // creates an empty locale
    }
  }

  // --- ACCESSORS ------------------------------------------------------------

  /**
   * Returns the values property of the current Locale instance
   * @returns {Translation[]}
   */
  getValues(): Translation[] {
    return this.values;
  }

  /**
   * Tells if the locale has some missing translations (counts the number of items in the missing property)
   * @returns {boolean}
   */
  hasMissingTranslations(): boolean {
    return this.missing.length > 0;
  }

  /**
   * Return the missing property of this object
   * @returns {Language[]}
   */
  getMissingTranslations(): Language[] {
    return this.missing;
  }

  /**
   * Adds a new entry in the values array and updates list of missing translations
   *
   * @param language            - The language of the added translation
   * @param string              - The translation to add
   * @param supportedLanguages  - The list of supported languages (required to update the list of missing translations)
   * @param isPending           - OPTIONAL: Allow creating a new translation (oldString = null, newString = string)
   */
  addTranslation(language: Language, string: string, supportedLanguages: Language[], isPending?: boolean) {
    let translation = new Translation(language, string, isPending);

    this.values.push(translation);
    this.missing = this.computeMissingTranslations(supportedLanguages);
  }

  /**
   * Defines both key and keyPath property of the current Locale instance.
   *
   * @param key - Dot delimited string representing the complete path of the key - Ex: 'product_name', 'errors.not_found'
   * @returns {Locale}
   */
  setKey(key: string): Locale {
    let keyParts = key.split('.');
    this.key = keyParts.pop();
    this.keyPath = keyParts.join('.');

    return this;
  }

  /**
   * Returns a dot separated complete version of the key taking into account nested objects
   * @returns {string}
   */
  getCompleteKey(): string {
    return (this.keyPath)
      ? this.keyPath + '.' + this.key
      : this.key;
  }

  // --- CLASS METHODS --------------------------------------------------------

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

  // --- INSTANCE METHODS -----------------------------------------------------

  /**
   * Sets the missing property of the current Locale instance by comparing the given list of supportedLanguages and the
   * already defined values in the values property.
   * @param supportedLanguages - The list of supported languages
   * @returns {Array}
   */
  computeMissingTranslations(supportedLanguages: Language[]): Language[] {
    let miss = [];
    let definedLanguages = this.values.map(translation => translation.language);

    for (let supportedLanguage of supportedLanguages) {
      let found = definedLanguages.filter(definedLanguage => definedLanguage.languageCode === supportedLanguage.languageCode);
      if (found.length === 0) {
        miss.push(supportedLanguage);
      }
    }

    return miss;
  }

  expand(state?: boolean): Locale {
    this.expanded = (state === undefined) ? !this.expanded : state;
    return this;
  }

  toggle(): Locale {
    return this.expand();
  }

  toLocaleUpdate(branch: string): LocaleUpdate[] {
    let updates = [];

    for (let newLocale of this.values) {
      let update = new LocaleUpdate();
      update.languageCode = newLocale.language.languageCode;
      update.key = this.getCompleteKey();
      update.branch = branch;
      update.value = {
        oldString: newLocale.string,
        newString: newLocale.editedString
      };

      updates.push(update);
    }

    return updates;
  }
}