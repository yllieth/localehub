import { Injectable } from '@angular/core';
import { Language } from "../+models";

const LANG = {
  "af":     { flagClass:"",   languageName: "Afrikaans", },
  "af-ZA":  { flagClass:"",   languageName: "Afrikaans (South Africa)", },
  "ar":     { flagClass:"",   languageName: "Arabic", },
  "ar-AE":  { flagClass:"",   languageName: "Arabic (U.A.E.)", },
  "ar-BH":  { flagClass:"bh", languageName: "Arabic (Bahrain)", },
  "ar-DZ":  { flagClass:"dz", languageName: "Arabic (Algeria)", },
  "ar-EG":  { flagClass:"eg", languageName: "Arabic (Egypt)", },
  "ar-IQ":  { flagClass:"iq", languageName: "Arabic (Iraq)", },
  "ar-JO":  { flagClass:"jo", languageName: "Arabic (Jordan)", },
  "ar-KW":  { flagClass:"kw", languageName: "Arabic (Kuwait)", },
  "ar-LB":  { flagClass:"lb", languageName: "Arabic (Lebanon)", },
  "ar-LY":  { flagClass:"ly", languageName: "Arabic (Libya)", },
  "ar-MA":  { flagClass:"ma", languageName: "Arabic (Morocco)", },
  "ar-OM":  { flagClass:"om", languageName: "Arabic (Oman)", },
  "ar-QA":  { flagClass:"qa", languageName: "Arabic (Qatar)", },
  "ar-SA":  { flagClass:"sa", languageName: "Arabic (Saudi Arabia)", },
  "ar-SY":  { flagClass:"sy", languageName: "Arabic (Syria)", },
  "ar-TN":  { flagClass:"tn", languageName: "Arabic (Tunisia)", },
  "ar-YE":  { flagClass:"ye", languageName: "Arabic (Yemen)", },
  "az":     { flagClass:"az", languageName: "Azeri (Latin)", },
  "az-AZ":  { flagClass:"az", languageName: "Azeri (Latin) (Azerbaijan)", },
  // "az-AZ":  { flagClass:"az", languageName: "Azeri (Cyrillic) (Azerbaijan)", },
  "be":     { flagClass:"by", languageName: "Belarusian", },
  "be-BY":  { flagClass:"by", languageName: "Belarusian (Belarus)", },
  "bg":     { flagClass:"bg", languageName: "Bulgarian", },
  "bg-BG":  { flagClass:"bg", languageName: "Bulgarian (Bulgaria)", },
  "bs-BA":  { flagClass:"ba", languageName: "Bosnian (Bosnia and Herzegovina)", },
  "ca":     { flagClass:"",   languageName: "Catalan", },
  "ca-ES":  { flagClass:"es", languageName: "Catalan (Spain)", },
  "cs":     { flagClass:"cz", languageName: "Czech", },
  "cs-CZ":  { flagClass:"cz", languageName: "Czech (Czech Republic)", },
  "cy":     { flagClass:"",   languageName: "Welsh", },
  "cy-GB":  { flagClass:"gb", languageName: "Welsh (United Kingdom)", },
  "da":     { flagClass:"",   languageName: "Danish", },
  "da-DK":  { flagClass:"dk", languageName: "Danish (Denmark)", },
  "de":     { flagClass:"de", languageName: "German", },
  "de-AT":  { flagClass:"at", languageName: "German (Austria)", },
  "de-CH":  { flagClass:"ch", languageName: "German (Switzerland)", },
  "de-DE":  { flagClass:"de", languageName: "German (Germany)", },
  "de-LI":  { flagClass:"li", languageName: "German (Liechtenstein)", },
  "de-LU":  { flagClass:"lu", languageName: "German (Luxembourg)", },
  "dv":     { flagClass:"md", languageName: "Divehi", },
  "dv-MV":  { flagClass:"mv", languageName: "Divehi (Maldives)", },
  "el":     { flagClass:"gr", languageName: "Greek", },
  "el-GR":  { flagClass:"gr", languageName: "Greek (Greece)", },
  "en":     { flagClass:"gb", languageName: "English", },
  "en-AU":  { flagClass:"au", languageName: "English (Australia)", },
  "en-BZ":  { flagClass:"bz", languageName: "English (Belize)", },
  "en-CA":  { flagClass:"ca", languageName: "English (Canada)", },
  "en-CB":  { flagClass:"",   languageName: "English (Caribbean)", },
  "en-GB":  { flagClass:"gb", languageName: "English (United Kingdom)", },
  "en-IE":  { flagClass:"ie", languageName: "English (Ireland)", },
  "en-JM":  { flagClass:"jm", languageName: "English (Jamaica)", },
  "en-NZ":  { flagClass:"nz", languageName: "English (New Zealand)", },
  "en-PH":  { flagClass:"ph", languageName: "English (Republic of the Philippines)", },
  "en-TT":  { flagClass:"tt", languageName: "English (Trinidad and Tobago)", },
  "en-US":  { flagClass:"us", languageName: "English (United States)", },
  "en-ZA":  { flagClass:"za", languageName: "English (South Africa)", },
  "en-ZW":  { flagClass:"zw", languageName: "English (Zimbabwe)", },
  "eo":     { flagClass:"",   languageName: "Esperanto", },
  "es":     { flagClass:"es", languageName: "Spanish", },
  "es-AR":  { flagClass:"ar", languageName: "Spanish (Argentina)", },
  "es-BO":  { flagClass:"bo", languageName: "Spanish (Bolivia)", },
  "es-CL":  { flagClass:"cl", languageName: "Spanish (Chile)", },
  "es-CO":  { flagClass:"co", languageName: "Spanish (Colombia)", },
  "es-CR":  { flagClass:"cr", languageName: "Spanish (Costa Rica)", },
  "es-DO":  { flagClass:"do", languageName: "Spanish (Dominican Republic)", },
  "es-EC":  { flagClass:"ec", languageName: "Spanish (Ecuador)", },
  // "es-ES":  { flagClass:"",   languageName: "Spanish (Castilian)", },
  "es-ES":  { flagClass:"es", languageName: "Spanish (Spain)", },
  "es-GT":  { flagClass:"gt", languageName: "Spanish (Guatemala)", },
  "es-HN":  { flagClass:"hn", languageName: "Spanish (Honduras)", },
  "es-MX":  { flagClass:"mx", languageName: "Spanish (Mexico)", },
  "es-NI":  { flagClass:"ni", languageName: "Spanish (Nicaragua)", },
  "es-PA":  { flagClass:"pa", languageName: "Spanish (Panama)", },
  "es-PE":  { flagClass:"pe", languageName: "Spanish (Peru)", },
  "es-PR":  { flagClass:"pr", languageName: "Spanish (Puerto Rico)", },
  "es-PY":  { flagClass:"py", languageName: "Spanish (Paraguay)", },
  "es-SV":  { flagClass:"sv", languageName: "Spanish (El Salvador)", },
  "es-UY":  { flagClass:"uy", languageName: "Spanish (Uruguay)", },
  "es-VE":  { flagClass:"ve", languageName: "Spanish (Venezuela)", },
  "et":     { flagClass:"ee", languageName: "Estonian", },
  "et-EE":  { flagClass:"ee", languageName: "Estonian (Estonia)", },
  "eu":     { flagClass:"",   languageName: "Basque", },
  "eu-ES":  { flagClass:"es", languageName: "Basque (Spain)", },
  "fa":     { flagClass:"",   languageName: "Farsi", },
  "fa-IR":  { flagClass:"ir", languageName: "Farsi (Iran)", },
  "fi":     { flagClass:"",   languageName: "Finnish", },
  "fi-FI":  { flagClass:"fi", languageName: "Finnish (Finland)", },
  "fo":     { flagClass:"",   languageName: "Faroese", },
  "fo-FO":  { flagClass:"fo", languageName: "Faroese (Faroe Islands)", },
  "fr":     { flagClass:"fr", languageName: "French", },
  "fr-BE":  { flagClass:"be", languageName: "French (Belgium)", },
  "fr-CA":  { flagClass:"ca", languageName: "French (Canada)", },
  "fr-CH":  { flagClass:"ch", languageName: "French (Switzerland)", },
  "fr-FR":  { flagClass:"fr", languageName: "French (France)", },
  "fr-LU":  { flagClass:"lu", languageName: "French (Luxembourg)", },
  "fr-MC":  { flagClass:"mc", languageName: "French (Principality of Monaco)", },
  "gl":     { flagClass:"",   languageName: "Galician", },
  "gl-ES":  { flagClass:"es", languageName: "Galician (Spain)", },
  "gu":     { flagClass:"",   languageName: "Gujarati", },
  "gu-IN":  { flagClass:"in", languageName: "Gujarati (India)", },
  "he":     { flagClass:"",   languageName: "Hebrew", },
  "he-IL":  { flagClass:"il", languageName: "Hebrew (Israel)", },
  "hi":     { flagClass:"",   languageName: "Hindi", },
  "hi-IN":  { flagClass:"in", languageName: "Hindi (India)", },
  "hr":     { flagClass:"",   languageName: "Croatian", },
  "hr-BA":  { flagClass:"ba", languageName: "Croatian (Bosnia and Herzegovina)", },
  "hr-HR":  { flagClass:"hr", languageName: "Croatian (Croatia)", },
  "hu":     { flagClass:"",   languageName: "Hungarian", },
  "hu-HU":  { flagClass:"hu", languageName: "Hungarian (Hungary)", },
  "hy":     { flagClass:"",   languageName: "Armenian", },
  "hy-AM":  { flagClass:"am", languageName: "Armenian (Armenia)", },
  "id":     { flagClass:"",   languageName: "Indonesian", },
  "id-ID":  { flagClass:"id", languageName: "Indonesian (Indonesia)", },
  "is":     { flagClass:"",   languageName: "Icelandic", },
  "is-IS":  { flagClass:"is", languageName: "Icelandic (Iceland)", },
  "it":     { flagClass:"it", languageName: "Italian", },
  "it-CH":  { flagClass:"ch", languageName: "Italian (Switzerland)", },
  "it-IT":  { flagClass:"it", languageName: "Italian (Italy)", },
  "ja":     { flagClass:"jp", languageName: "Japanese", },
  "ja-JP":  { flagClass:"jp", languageName: "Japanese (Japan)", },
  "ka":     { flagClass:"",   languageName: "Georgian", },
  "ka-GE":  { flagClass:"ge", languageName: "Georgian (Georgia)", },
  "kk":     { flagClass:"",   languageName: "Kazakh", },
  "kk-KZ":  { flagClass:"kz", languageName: "Kazakh (Kazakhstan)", },
  "kn":     { flagClass:"",   languageName: "Kannada", },
  "kn-IN":  { flagClass:"in", languageName: "Kannada (India)", },
  "ko":     { flagClass:"",   languageName: "Korean", },
  "ko-KR":  { flagClass:"kr", languageName: "Korean (Korea)", },
  "kok":    { flagClass:"",   languageName: "Konkani", },
  "kok-IN": { flagClass:"in", languageName: "Konkani (India)", },
  "ky":     { flagClass:"",   languageName: "Kyrgyz", },
  "ky-KG":  { flagClass:"kg", languageName: "Kyrgyz (Kyrgyzstan)", },
  "lt":     { flagClass:"",   languageName: "Lithuanian", },
  "lt-LT":  { flagClass:"lt", languageName: "Lithuanian (Lithuania)", },
  "lv":     { flagClass:"",   languageName: "Latvian", },
  "lv-LV":  { flagClass:"lv", languageName: "Latvian (Latvia)", },
  "mi":     { flagClass:"",   languageName: "Maori", },
  "mi-NZ":  { flagClass:"nz", languageName: "Maori (New Zealand)", },
  "mk":     { flagClass:"",   languageName: "FYRO Macedonian", },
  "mk-MK":  { flagClass:"mk", languageName: "FYRO Macedonian (Former Yugoslav Republic of Macedonia)", },
  "mn":     { flagClass:"",   languageName: "Mongolian", },
  "mn-MN":  { flagClass:"mn", languageName: "Mongolian (Mongolia)", },
  "mr":     { flagClass:"",   languageName: "Marathi", },
  "mr-IN":  { flagClass:"in", languageName: "Marathi (India)", },
  "ms":     { flagClass:"",   languageName: "Malay", },
  "ms-BN":  { flagClass:"bn", languageName: "Malay (Brunei Darussalam)", },
  "ms-MY":  { flagClass:"my", languageName: "Malay (Malaysia)", },
  "mt":     { flagClass:"",   languageName: "Maltese", },
  "mt-MT":  { flagClass:"mt", languageName: "Maltese (Malta)", },
  "nb":     { flagClass:"",   languageName: "Norwegian (Bokm?l)", },
  "nb-NO":  { flagClass:"no", languageName: "Norwegian (Bokm?l) (Norway)", },
  "nl":     { flagClass:"",   languageName: "Dutch", },
  "nl-BE":  { flagClass:"be", languageName: "Dutch (Belgium)", },
  "nl-NL":  { flagClass:"nl", languageName: "Dutch (Netherlands)", },
  "nn-NO":  { flagClass:"no", languageName: "Norwegian (Nynorsk) (Norway)", },
  "ns":     { flagClass:"",   languageName: "Northern Sotho", },
  "ns-ZA":  { flagClass:"za", languageName: "Northern Sotho (South Africa)", },
  "pa":     { flagClass:"",   languageName: "Punjabi", },
  "pa-IN":  { flagClass:"in", languageName: "Punjabi (India)", },
  "pl":     { flagClass:"pl", languageName: "Polish", },
  "pl-PL":  { flagClass:"pl", languageName: "Polish (Poland)", },
  "ps":     { flagClass:"",   languageName: "Pashto", },
  "ps-AR":  { flagClass:"af", languageName: "Pashto (Afghanistan)", },
  "pt":     { flagClass:"",   languageName: "Portuguese", },
  "pt-BR":  { flagClass:"br", languageName: "Portuguese (Brazil)", },
  "pt-PT":  { flagClass:"pt", languageName: "Portuguese (Portugal)", },
  "qu":     { flagClass:"",   languageName: "Quechua", },
  "qu-BO":  { flagClass:"bo", languageName: "Quechua (Bolivia)", },
  "qu-EC":  { flagClass:"ec", languageName: "Quechua (Ecuador)", },
  "qu-PE":  { flagClass:"pe", languageName: "Quechua (Peru)", },
  "ro":     { flagClass:"ro", languageName: "Romanian", },
  "ro-RO":  { flagClass:"ro", languageName: "Romanian (Romania)", },
  "ru":     { flagClass:"ru", languageName: "Russian", },
  "ru-RU":  { flagClass:"ru", languageName: "Russian (Russia)", },
  "sa":     { flagClass:"",   languageName: "Sanskrit", },
  "sa-IN":  { flagClass:"in", languageName: "Sanskrit (India)", },
  "se":     { flagClass:"",   languageName: "Sami (Northern)", },
  "se-FI":  { flagClass:"fi", languageName: "Sami (Northern) (Finland)", },
  // "se-FI":  { flagClass:"",   languageName: "Sami (Skolt) (Finland)", },
  // "se-FI":  { flagClass:"",   languageName: "Sami (Inari) (Finland)", },
  "se-NO":  { flagClass:"no", languageName: "Sami (Northern) (Norway)", },
  // "se-NO":  { flagClass:"",   languageName: "Sami (Lule) (Norway)", },
  // "se-NO":  { flagClass:"",   languageName: "Sami (Southern) (Norway)", },
  "se-SE":  { flagClass:"se", languageName: "Sami (Northern) (Sweden)", },
  // "se-SE":  { flagClass:"",   languageName: "Sami (Lule) (Sweden)", },
  // "se-SE":  { flagClass:"",   languageName: "Sami (Southern) (Sweden)", },
  "sk":     { flagClass:"sk", languageName: "Slovak", },
  "sk-SK":  { flagClass:"sk", languageName: "Slovak (Slovakia)", },
  "sl":     { flagClass:"si", languageName: "Slovenian", },
  "sl-SI":  { flagClass:"si", languageName: "Slovenian (Slovenia)", },
  "sq":     { flagClass:"al", languageName: "Albanian", },
  "sq-AL":  { flagClass:"al", languageName: "Albanian (Albania)", },
  "sr-BA":  { flagClass:"ba", languageName: "Serbian (Latin) (Bosnia and Herzegovina)", },
  // "sr-BA":  { flagClass:"",   languageName: "Serbian (Cyrillic) (Bosnia and Herzegovina)", },
  "sr-SP":  { flagClass:"",   languageName: "Serbian (Latin) (Serbia and Montenegro)", },
  // "sr-SP":  { flagClass:"",   languageName: "Serbian (Cyrillic) (Serbia and Montenegro)", },
  "sv":     { flagClass:"",   languageName: "Swedish", },
  "sv-FI":  { flagClass:"fi", languageName: "Swedish (Finland)", },
  "sv-SE":  { flagClass:"se", languageName: "Swedish (Sweden)", },
  "sw":     { flagClass:"ke", languageName: "Swahili", },
  "sw-KE":  { flagClass:"ke", languageName: "Swahili (Kenya)", },
  "syr":    { flagClass:"sy", languageName: "Syriac", },
  "syr-SY": { flagClass:"sy", languageName: "Syriac (Syria)", },
  "ta":     { flagClass:"",   languageName: "Tamil", },
  "ta-IN":  { flagClass:"in", languageName: "Tamil (India)", },
  "te":     { flagClass:"",   languageName: "Telugu", },
  "te-IN":  { flagClass:"in", languageName: "Telugu (India)", },
  "th":     { flagClass:"",   languageName: "Thai", },
  "th-TH":  { flagClass:"th", languageName: "Thai (Thailand)", },
  "tl":     { flagClass:"",   languageName: "Tagalog", },
  "tl-PH":  { flagClass:"ph", languageName: "Tagalog (Philippines)", },
  "tn":     { flagClass:"",   languageName: "Tswana", },
  "tn-ZA":  { flagClass:"za", languageName: "Tswana (South Africa)", },
  "tr":     { flagClass:"",   languageName: "Turkish", },
  "tr-TR":  { flagClass:"tr", languageName: "Turkish (Turkey)", },
  "tt":     { flagClass:"",   languageName: "Tatar", },
  "tt-RU":  { flagClass:"ru", languageName: "Tatar (Russia)", },
  "ts":     { flagClass:"",   languageName: "Tsonga", },
  "uk":     { flagClass:"",   languageName: "Ukrainian", },
  "uk-UA":  { flagClass:"ua", languageName: "Ukrainian (Ukraine)", },
  "ur":     { flagClass:"",   languageName: "Urdu", },
  "ur-PK":  { flagClass:"pk", languageName: "Urdu (Islamic Republic of Pakistan)", },
  "uz":     { flagClass:"",   languageName: "Uzbek (Latin)", },
  "uz-UZ":  { flagClass:"uz", languageName: "Uzbek (Latin) (Uzbekistan)", },
  // "uz-UZ":  { flagClass:"",   languageName: "Uzbek (Cyrillic) (Uzbekistan)", },
  "vi":     { flagClass:"",   languageName: "Viet, languageNamese", },
  "vi-VN":  { flagClass:"vn", languageName: "Viet, languageNamese (Viet Nam)", },
  "xh":     { flagClass:"",   languageName: "Xhosa", },
  "xh-ZA":  { flagClass:"za", languageName: "Xhosa (South Africa)", },
  "zh":     { flagClass:"cn", languageName: "Chinese", },
  "zh-CN":  { flagClass:"cn", languageName: "Chinese (S)", },
  "zh-HK":  { flagClass:"hk", languageName: "Chinese (Hong Kong)", },
  "zh-MO":  { flagClass:"mo", languageName: "Chinese (Macau)", },
  "zh-SG":  { flagClass:"sg", languageName: "Chinese (Singapore)", },
  "zh-TW":  { flagClass:"tw", languageName: "Chinese (Taiwan)", },
  "zu":     { flagClass:"",   languageName: "Zulu", },
  "zu-ZA":  { flagClass:"za", languageName: "Zulu (South Africa)", },
};

@Injectable()
export class LanguageService {
  private static getCountryOrParent(languageCode: string): any {
    let allLanguages = Object.keys(LANG);

    if (allLanguages.indexOf(languageCode) >= 0) {
      if (LANG[languageCode].flagCss.length > 0) {
        // if found, return details of the country
        return LANG[languageCode];
      } else if (languageCode.indexOf('-') >= 0 && LANG[languageCode.split('-').shift()].flagCss.length > 0) {
        // if country does not have a valid css property, we try to use its parent ("en" is the parent of "en-US")
        return LANG[languageCode.split('-').shift()];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  // public methods

  public static entireList(): Language[] {
    let list = [];

    for(let code in LANG) {
      let country = LANG[code];
      country.languageCode = code;
      list.push(country);
    }

    return list;
  }

  public static find(languageCode: string): Language {
    if (LANG.hasOwnProperty(languageCode) === true) {
      let country = LANG[languageCode];
      country.languageCode = languageCode;

      return country;
    } else {
      return new Language();
    }
  }
}