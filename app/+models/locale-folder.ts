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
  }

  addChildren(child: LocaleFolder): void {

  }

  addLocale(locale: Locale): void {

  }
}