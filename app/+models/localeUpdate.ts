export class LocaleUpdate {
  branch: string;
  languageCode: string;
  key: string;
  value: {
    newString: string;
    oldString: string;
  };

  $metadata?: any = {};
}