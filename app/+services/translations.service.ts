import { Injectable } from '@angular/core';
import { LocaleFolder } from '../+models/locale-folder';
import {serialize} from "@angular/compiler/src/i18n/serializers/xml_helper";

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

  createList(dictionaries: any): LocaleFolder {
    let root = new LocaleFolder('##ROOT##');
    let languages = Object.keys(dictionaries);
    let formattedDictionaries = {}; //this.createEmptyDictionary(languages);

    // format each dictionary
    for (let lang in dictionaries) {
      formattedDictionaries[lang] = this.format(dictionaries[lang], lang, languages);
    }

    // initialize root dictionary with the first formatted dictionary
    let first = languages.shift();
    root.initialize(formattedDictionaries[first].getChildren(), formattedDictionaries[first].getLocales());

    return root;
  }
}