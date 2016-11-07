import { Injectable } from '@angular/core';
import { LocaleFolder } from '../+models/locale-folder';

@Injectable()
export class TranslationsService {
  createList(dictionaries: any): LocaleFolder {
    let root = new LocaleFolder('##ROOT##');

    return root;
  }
}