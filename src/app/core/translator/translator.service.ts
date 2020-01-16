import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from '../../config';

@Injectable()
export class TranslatorService {
    private defaultLanguage: string = DEFAULT_LANGUAGE;
    private availablelangs = AVAILABLE_LANGUAGES;

    constructor(public translate: TranslateService) {

        if (!translate.getDefaultLang())
            translate.setDefaultLang(this.defaultLanguage);

        this.useLanguage();

    }

    useLanguage(lang: string = null) {
        this.translate.use(lang || this.translate.getDefaultLang());
    }

    getAvailableLanguages() {
        return this.availablelangs;
    }

}
