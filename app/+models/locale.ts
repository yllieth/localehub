import { Translation } from "./translation";

/**
 * A locale associates an i18n key with one (or more) translation(s).
 *
 * Example
 * - key: "subtitle"
 * - values:
 *   - lang: fr,    string: %{brand} est fait par des <span>humains</span>
 *   - lang: en-US, string: %{brand% is made by <span>humans</span>
 * - missing: [ "ja" ]
 */
export class Locale {
  key: string;
  values: Translation[];
  missing: string[];
  expanded: boolean;

  constructor(key: string, value: string, currentLanguage: string, languages: string[]) {
    let translation = new Translation(currentLanguage, value);
    if (this.values === undefined) { this.values = [] }

    this.key = key;
    this.values.push(translation);
    this.missing = languages.filter((lang: string) => {
      return lang != currentLanguage;
    });
    this.expanded = false;
  }

  getValues(): Translation[] {
    return this.values;
  }

  getMissingTranslations(): string[] {
    return this.missing;
  }

  expand(state?: boolean): Locale {
    this.expanded = (state === undefined) ? !this.expanded : state;
    return this;
  }

  toggle(): Locale {
    return this.expand();
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
          found[0].missing = found[0].missing.filter(lang => { return lang != translation.lang; })
        }
      } else {
        console.error('Internal error: the key ' + searchedKey + ' has been found ' + found.length + ' times. The input file is errored.')
      }
    }
  }
}