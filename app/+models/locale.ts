import { Translation } from "./translation";
import {isUndefined} from "util";

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

  constructor(key: string, value: string, currentLanguage: string, languages: string[]) {
    let translation = new Translation(currentLanguage, value);
    if (this.values === undefined) { this.values = [] }

    this.key = key;
    this.values.push(translation);
    this.missing = languages.filter((lang: string) => {
      return lang != currentLanguage;
    });
  }
}