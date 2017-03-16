import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams, Response } from '@angular/http';
import { I18nFileInfo, Language, LocaleFolder, Locale, Project } from '../+models';
import { ApiService, LanguageService } from './';

@Injectable()
export class TranslationsService {
  constructor(private api: ApiService,) {}

  private format(locales: any, currentLanguage: Language, allLanguages: Language[]): LocaleFolder {
    let serializeDeepKeys = (jsonPath: string, locales: any, folder: LocaleFolder) => {
      for (let key in locales) {
        let value = locales[key];
        let parent = (jsonPath === null) ? key : jsonPath + '.' + key;
        if (typeof value === 'object') {
          serializeDeepKeys(parent, value, folder.addTrustedChild(parent));
        }
        if (typeof value === 'string') {
          folder.addTrustedLocale(parent, value, currentLanguage, allLanguages);
        }
      }
    };

    let root = new LocaleFolder(currentLanguage.languageCode); // languageCode is just for debugging purposes (being able to differentiate iterations)
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

  createList(dictionaries: {content: any, metadata: I18nFileInfo}[]): LocaleFolder {
    let root = new LocaleFolder(LocaleFolder.ROOT_NAME);
    let languages: Language[] = dictionaries.map(d => LanguageService.find(d.metadata.languageCode));
    let formattedDictionaries = []; // { content: any, language: Language }

    // format each dictionary
    for (let dictionary of dictionaries) {
      let language = LanguageService.find(dictionary.metadata.languageCode);
      formattedDictionaries.push({
        content: this.format(dictionary.content, language, languages),
        language
      });
    }

    // initialize root dictionary with the first formatted dictionary
    root.initialize(formattedDictionaries[0].content.getChildren(), formattedDictionaries[0].content.getLocales());

    // merge other formatted dictionaries inside root element
    for (let i = 1 ; i < formattedDictionaries.length ; i++) {
      this.merge(formattedDictionaries[i].content, root);
    }

    return root;
  }

  getDictionaries(project: Project): Promise<any> {
    let requestLanguages = [];
    for (let i18nFile of project.i18nFiles) {
      requestLanguages.push(this.getTranslation(project.id, i18nFile.languageCode, project.lastActiveBranch));
    }

    return Promise.all(requestLanguages).catch(error => Promise.reject(error));
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

  /**
   * Checks if file given in the path parameter exists in the giver repo.
   * If so, it parses the json object and count the number of defined translations.
   * Github base request : GET api.github.com/repos/:owner/:repo/contents/:path
   *   | using lambda: gh-get-repos-content
   *   | using lambda: i18nFile-parse
   *
   * @param {string} repo - Ex: yllieth/localehub
   * @param {string} path - Ex: assets/test/en.json
   * @param {string} languageCode - Ex: en.json
   * @param {string} branch - Ex: master
   * @returns {Promise<I18nFileInfo>}
   */
  checkI18nfile(repo: string, path: string, languageCode: string, branch: string): Promise<I18nFileInfo> {
    return this.api
      .post(`${ApiService.endpoint.prod}/i18n/file`, {repo, path, languageCode, branch})
      .toPromise()
      .then((response: Response) => response.json() as I18nFileInfo)
      .catch(error => Promise.reject(error));
  }
}