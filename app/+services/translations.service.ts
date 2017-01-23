import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams} from "@angular/http";
import { I18nFileInfo, LocaleFolder, Locale, Project } from '../+models';
import { ApiService } from './';

@Injectable()
export class TranslationsService {
  constructor(private api: ApiService,) {}

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

  private prepareDictionaries(responses: {content: any, metadata: I18nFileInfo}[]): any {
    let dictionaries = {};
    for (let response of responses) {
      dictionaries[response.metadata.languageCode] = response.content;
    }

    return dictionaries
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

  getDictionaries(project: Project): Promise<any> {
    let requestLanguages = [];
    for (let i18nFile of project.i18nFiles) {
      requestLanguages.push(this.getTranslation(project.id, i18nFile.languageCode, project.lastActiveBranch));
    }

    return Promise.all(requestLanguages)
      .then(response => this.prepareDictionaries(response))
      .catch(error => Promise.reject(error));
  }

  getTranslation(projectId: string, languageCode: string, branch: string): Promise<{content: any, metadata: I18nFileInfo}> {
    let queryStringParameters = new URLSearchParams();
    queryStringParameters.set('languageCode', languageCode);
    queryStringParameters.set('branch', branch);

    let options = new RequestOptions();
    options.search = queryStringParameters;

    return this.api
      .get(`${ApiService.endpoint.prod}/projects/${projectId}/translations`, options)
      .toPromise()
      .then(response => response.json())
      .catch(error => Promise.reject(error));
  }
}