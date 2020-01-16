import { Injectable } from '@angular/core';
import { RequestService } from '../../request.service';

@Injectable({
  providedIn: 'root'
})
export class ContactPersonService {

  constructor (private requestService: RequestService) {}

  getAllContactPersonForContract (urlParams) {
    return this.requestService.doGET(
      `/api/contracts/${urlParams.contractId}/contact-persons`,
      'API_CONTRACT'
    );
  }

  createContactPerson (data, urlParams) {
    return this.requestService.doPOST(
      `/api/contracts/${urlParams.contractId}/contact-persons`,
      data,
      'API_CONTRACT'
    );
  }

  updateContactPerson (data, urlParams) {
    return this.requestService.doPUT(
      `/api/contracts/${urlParams.contractId}/contact-persons/${urlParams.contactPersonId}`,
      data,
      'API_CONTRACT'
    );
  }

  deleteContactPerson (urlParams) {
    return this.requestService.doDELETE(
      `/api/contracts/${urlParams.contractId}/contact-persons/${urlParams.contactPersonId}`,
      'API_CONTRACT'
    );
  }

  getAllCountryList () {
    return this.requestService.doGET(
      '/api/mdm/country-list',
      'API_CONTRACT'
    );
  }

  getAllFunctions () {
    return this.requestService.doGET(
      '/api/mdm/client/functions',
      'API_CONTRACT'
    );
  }
}
