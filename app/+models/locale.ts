import { Translation } from "./translation";

/**
 * A locale associates an i18n key with one (or more) translation(s).
 *
 * Example
 * - key: "subtitle"
 * - values:
 *   - fr: %{brand} est fait par des <span>humains</span>
 *   - en-US: %{brand% is made by <span>humans</span>
 * - missing: [ "ja" ]
 */
export class Locale {
  key: string;
  values: Translation[];
  missing: string[];
}