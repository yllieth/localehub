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
  expanded: boolean;

  constructor(name: string) {
    this.name = name;
    this.children = [];
    this.locales = [];
    this.expanded = false;
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

  hasChild(): boolean {
    return this.children.length > 0;
  }

  getLocales(): Locale[] {
    return this.locales;
  }

  initialize(children: LocaleFolder[], locales: Locale[]): LocaleFolder {
    if (this.children.length === 0) {
      this.children = children
    } else {
      console.error('Internal error: Cannot set children of non-empty LocaleFolder. Overwrite risks!', this.children);
      return;
    }

    if (this.locales.length === 0) {
      this.locales = locales;
    } else {
      console.error('Internal error: Cannot set locales of non-empty LocaleFolder. Overwrite risks!', this.locales);
      return;
    }

    return this;
  }

  expand(state?: boolean): LocaleFolder {
    this.expanded = (state === undefined) ? !this.expanded : state;
    return this;
  }

  toggle(): LocaleFolder {
    return this.expand();
  }

  /**
   * Merge two sets of localefolders (from different languages).
   *
   * While iterating over the folders of the SRC param search for a folder in the DEST which has the same name,
   * - if you find one: merge locales and continue recursively deeper in each child
   * - if you don't find one: create a new LocaleFolder in the DEST
   *
   * @param src
   * @param dest
   */
  static merge(src: LocaleFolder[], dest: LocaleFolder[]) {
    for (let srcFolder of src) {
      let searchedName = srcFolder.name;
      let found: LocaleFolder[] = dest.filter((candidate: LocaleFolder) => {
        return candidate.name === searchedName;
      });

      if (found.length === 0) {
        dest.push(srcFolder);
      } else if (found.length === 1) {
        Locale.merge(srcFolder.getLocales(), found[0].getLocales());
        LocaleFolder.merge(srcFolder.getChildren(), found[0].getChildren());
      } else {
        console.error('Internal error: the name ' + searchedName + ' has been found ' + found.length + ' times. The input file is errored.')
      }
    }
  }
}