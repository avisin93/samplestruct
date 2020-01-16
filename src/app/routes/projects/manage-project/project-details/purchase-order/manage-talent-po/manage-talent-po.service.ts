import { Injectable } from '@angular/core';
import { HttpRequest } from '@app/common';
import { API_URL } from '@app/config';

@Injectable()
export class ManageTalentPoService {

    constructor(private _http: HttpRequest) { }
    getTalentBudgetLines(budgetId) {
        return this._http.get(API_URL.talentPOBudgetLines + '/' + budgetId);
    }
    getTalentAgencies(params) {
        return this._http.get(API_URL.talentPOAgency, params);
    }
    getIndividualList(params) {
        return this._http.get(API_URL.talentPOIndividual, params);
    }
    getTalentCategories() {
        return this._http.get(API_URL.talentPOCategory);
    }
    getTalentServices() {
        return this._http.get(API_URL.talentPOService);
    }
    getTalentMedia() {
        return this._http.get(API_URL.talentPOMedia);
    }
    getTalentRole() {
        return this._http.get(API_URL.talentPORole);
    }
    getTalentTerritory() {
        return this._http.get(API_URL.talentPOTerritory);
    }
    getTalentPODetails(poId) {
        return this._http.get(API_URL.talentPO + '/' + poId);
    }
    addTalentPO(data) {
        return this._http.post(API_URL.talentPO, JSON.stringify(data));
    }
    updateTalentPO(poId: string, data: any) {
        return this._http.put(API_URL.talentPO + '/' + poId, JSON.stringify(data));
    }
}
