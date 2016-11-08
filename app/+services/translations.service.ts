import { Injectable } from '@angular/core';
import { LocaleFolder } from '../+models/locale-folder';
import { Locale } from '../+models/locale';

@Injectable()
export class TranslationsService {
  private format(locales: any, currentLanguage: string, allLanguages: string[]): LocaleFolder {
    let serializeDeepKeys = (locales: any, folder: LocaleFolder) => {
      for (let key in locales) {
        let value = locales[key];
        if (typeof value === 'object') {
          serializeDeepKeys(value, folder.addTrustedChild(key));
        }
        if (typeof value === 'string') {
          folder.addTrustedLocale(key, value, currentLanguage, allLanguages);
        }
      }
    };

    let root = new LocaleFolder(currentLanguage);
    serializeDeepKeys(locales, root);
    return root;
  }

  private merge(src: LocaleFolder, dest: LocaleFolder): void {
    let mergableLocales = src.getLocales();
    if (mergableLocales.length > 0) {
      Locale.merge(mergableLocales, dest.getLocales());
    }

    let mergableChildren = src.getChildren();
    if (mergableChildren.length > 0) {
      LocaleFolder.merge(mergableChildren, dest.getChildren());
    }
  }

  createList(dictionaries: any): LocaleFolder {
    let root = new LocaleFolder('##ROOT##');
    let languages = Object.keys(dictionaries);
    let formattedDictionaries = {};

    // format each dictionary
    for (let lang in dictionaries) {
      formattedDictionaries[lang] = this.format(dictionaries[lang], lang, languages);
    }

    // initialize root dictionary with the first formatted dictionary
    let first = languages.shift();
    root.initialize(formattedDictionaries[first].getChildren(), formattedDictionaries[first].getLocales());

    // merge other formatted dictionaries inside root element
    for (let lang of languages) {
      // console.info('Merging ' + lang + ' into ' + first);
      this.merge(formattedDictionaries[lang], root);
    }

    return root.expand(true);
  }
}