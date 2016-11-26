import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { LocaleFolder, Locale } from '../+models';
import { AuthenticationService, ApiService } from './';

@Injectable()
export class TranslationsService {
  private all = (owner: string, repo: string) => `${ApiService.endpoint.mock}/translations/${owner}/${repo}`;

  constructor(private $http: Http) {}

  private format(locales: any, currentLanguage: string, allLanguages: string[]): LocaleFolder {
    let serializeDeepKeys = (jsonPath: string, locales: any, folder: LocaleFolder) => {
      for (let key in locales) {
        let value = locales[key];
        let parent = (jsonPath === null) ? key : jsonPath + '.' + key;
        if (typeof value === 'object') {
          serializeDeepKeys(parent, value, folder.addTrustedChild(key));
        }
        if (typeof value === 'string') {
          folder.addTrustedLocale(parent, value, currentLanguage, allLanguages);
        }
      }
    };

    let root = new LocaleFolder(currentLanguage);
    serializeDeepKeys(null, locales, root);
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

  getDictionaries(owner: string, repo: string): Promise<any> {
    return this.$http
      .get(this.all(owner, repo))
      .toPromise()
      .then((response: Response) => response.json())
      .catch(error => Promise.reject(error));
  }
}