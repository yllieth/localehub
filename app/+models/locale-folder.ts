import { Locale } from "./locale";

/**
 * The LocaleFolder groups several Locales and structures them. It's a structure developed close to the
 * design of the page and represents the tree.
 *
 * Note: There are -at least- one LocaleFolder named "##ROOT##".
 */
export class LocaleFolder {
  name: string;
  children: LocaleFolder[];
  locales: Locale[];

  constructor(name: string) {
    this.name = name;
    this.children = [];
    this.locales = [];
  }

  addTrustedLocale(key: string, value: string, currentLanguage: string, allLanguage: string[]): LocaleFolder {
    this.locales.push(new Locale(key, value, currentLanguage, allLanguage));

    return this;
  }

  addTrustedChild(name: string): LocaleFolder {
    let child = new LocaleFolder(name);
    this.children.push(child);

    return child;
  }

  getChildren(): LocaleFolder[] {
    return this.children;
  }

  getLocales(): Locale[] {
    return this.locales;
  }

  initialize(children: LocaleFolder[], locales: Locale[]): LocaleFolder {
    if (this.children.length === 0) {
      this.children = children
    } else {
      console.error('Internal error: Cannot set children of non-empty LocaleFolder. Overwrite risks!');
      return;
    }

    if (this.locales.length === 0) {
      this.locales = locales;
    } else {
      console.error('Internal error: Cannot set locales of non-empty LocaleFolder. Overwrite risks!');
      return;
    }

    return this;
  }

  merge(formattedDictionary: LocaleFolder): LocaleFolder {
    let mergableLocales = formattedDictionary.getLocales();
    if (mergableLocales.length > 0) {
      Locale.merge(mergableLocales, this.getLocales());
    }

    return this;
  }
}