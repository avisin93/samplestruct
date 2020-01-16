import { Injectable } from '@angular/core';
import { RequestService } from '../../../modules/request.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommercialsService {

  constructor (private requestService: RequestService) { }

  getAllUoms () {
    return this.requestService.doGET(
      '/api/mdm/client/uoms',
      'API_CONTRACT'
    );
  }

  getAllServices () {
    return this.requestService.doGET(
      '/api/mdm/services',
      'API_CONTRACT'
    );
  }

  getAllClientServices () {
    return this.requestService.doGET(
      '/api/mdm/client/services',
      'API_CONTRACT'
    );
  }

  getAllSubServices () {
    return this.requestService.doGET(
      '/api/mdm/subservices',
      'API_CONTRACT'
    );
  }

  getAllClientSubServices () {
    return this.requestService.doGET(
      '/api/mdm/client/subservices',
      'API_CONTRACT'
    );
  }

  getAllTierTypes () {
    return this.requestService.doGET(
      '/api/mdm/tier-types',
      'API_CONTRACT'
    );
  }

  getAllCurrencies () {
    return this.requestService.doGET(
      '/api/mdm/currencies',
      'API_CONTRACT'
    );
  }

  getAllVolumeSplit () {
    return this.requestService.doGET(
      '/api/mdm/volume-splits',
      'API_CONTRACT'
    );
  }

  getAllApplicableFactors () {
    return this.requestService.doGET(
      '/api/mdm/applicable-factors',
      'API_CONTRACT'
    );
  }

  getAllApplicablePeriods () {
    return this.requestService.doGET(
      '/api/mdm/applicable-periods',
      'API_CONTRACT'
    );
  }

  getAllLinkedOpportunities () {
    return this.requestService.doGET(
      '/api/mdm/linked-opportunities',
      'API_CONTRACT'
    );
  }

  getAllClientLinkedOpportunities () {
    return this.requestService.doGET(
      '/api/mdm/client/linked-opportunities',
      'API_CONTRACT'
    );
  }

  getAllBillingTypes () {
    return this.requestService.doGET(
      '/api/mdm/billing-types',
      'API_CONTRACT'
    );
  }

  getAllProjects () {
    return this.requestService.doGET(
      '/api/mdm/projects',
      'API_CONTRACT'
    );
  }

  getAllClientProjects () {
    return this.requestService.doGET(
      '/api/mdm/client/projects',
      'API_CONTRACT'
    );
  }

  getAllRelatedDocs () {
    return this.requestService.doGET(
      '/api/mdm/related-docs',
      'API_CONTRACT'
    );
  }

  getAllSubProjects () {
    return this.requestService.doGET(
      '/api/mdm/subprojects',
      'API_CONTRACT'
    );
  }

/* Start Transaction Rate Standard */
  createTransactionRateStandard (data, urlParams) {
    return this.requestService.doPOST(
      `/api/contracts/${urlParams.contractId}/transaction-rates-standards`,
      data,
      'API_CONTRACT'
    );
  }

  getAllTransactionRatesStandards (urlParams) {
    return this.requestService.doGET(
      `/api/contracts/${urlParams.contractId}/transaction-rates-standards`,
      'API_CONTRACT'
    );
  }

  deleteTransactionRateStandard (urlParams) {
    return this.requestService.doDELETE(
      `/api/contracts/${urlParams.contractId}/transaction-rates-standards/${urlParams.transactionRateStandardId}`,
      'API_CONTRACT'
    );
  }

  updateTransactionRateStandard (data, urlParams) {
    return this.requestService.doPUT(
      `/api/contracts/${urlParams.contractId}/transaction-rates-standards/${urlParams.transactionRateStandardId}`,
      data,
      'API_CONTRACT'
    );
  }
  /* End Transaction Rate Standard*/

  /* Start Transaction Rate Volume */
  createTransactionRateVolume (data, urlParams) {
    return this.requestService.doPOST(
      `/api/contracts/${urlParams.contractId}/transaction-rates-volumes`,
      data,
      'API_CONTRACT'
    );
  }

  getAllTransactionRatesVolumes (urlParams) {
    return this.requestService.doGET(
      `/api/contracts/${urlParams.contractId}/transaction-rates-volumes`,
      'API_CONTRACT'
    );
  }

  deleteTransactionRateVolume (urlParams) {
    return this.requestService.doDELETE(
      `/api/contracts/${urlParams.contractId}/transaction-rates-volumes/${urlParams.transactionRateVolumeId}`,
      'API_CONTRACT'
    );
  }

  updateTransactionRateVolume (data, urlParams) {
    return this.requestService.doPUT(
      `/api/contracts/${urlParams.contractId}/transaction-rates-volumes/${urlParams.transactionRateVolumeId}`,
      data,
      'API_CONTRACT'
    );
  }
  /* End Transaction Rate Volume */

  /* Start Time And Material */
  createTimeAndMaterial (data, urlParams) {
    return this.requestService.doPOST(
      `/api/contracts/${urlParams.contractId}/time-and-materials`,
      data,
      'API_CONTRACT'
    );
  }

  getAllTimeAndMaterials (urlParams) {
    return this.requestService.doGET(
      `/api/contracts/${urlParams.contractId}/time-and-materials`,
      'API_CONTRACT'
    );
  }

  deleteTimeAndMaterial (urlParams) {
    return this.requestService.doDELETE(
      `/api/contracts/${urlParams.contractId}/time-and-materials/${urlParams.timeAndMaterialId}`,
      'API_CONTRACT'
    );
  }

  updateTimeAndMaterial (data, urlParams) {
    return this.requestService.doPUT(
      `/api/contracts/${urlParams.contractId}/time-and-materials/${urlParams.timeAndMaterialId}`,
      data,
      'API_CONTRACT'
    );
  }
  /* End Time And Material */

  /* Start Fixed Fee */
  getAllFixedFees (urlParams) {
    return this.requestService.doGET(
      `/api/contracts/${urlParams.contractId}/fixed-fees`,
      'API_CONTRACT'
    );
  }

  createFixedFee (data, urlParams) {
    return this.requestService.doPOST(
      `/api/contracts/${urlParams.contractId}/fixed-fees`,
      data,
      'API_CONTRACT'
    );
  }

  updateFixedFee (data, urlParams) {
    return this.requestService.doPUT(
      `/api/contracts/${urlParams.contractId}/fixed-fees/${urlParams.fixedFeeId}`,
      data,
      'API_CONTRACT'
    );
  }

  deleteFixedFee (urlParams) {
    return this.requestService.doDELETE(
      `/api/contracts/${urlParams.contractId}/fixed-fees/${urlParams.fixedFeeId}`,
      'API_CONTRACT'
    );
  }
  /* End Fixed Fee */

  /* Start Minimum Billing */
  getAllMinimumBillings (urlParams) {
    return this.requestService.doGET(
      `/api/contracts/${urlParams.contractId}/minimum-billings`,
      'API_CONTRACT'
    );
  }

  createMinimumBilling (data, urlParams) {
    return this.requestService.doPOST(
      `/api/contracts/${urlParams.contractId}/minimum-billings`,
      data,
      'API_CONTRACT'
    );
  }

  updateMinimumBilling (data, urlParams) {
    return this.requestService.doPUT(
      `/api/contracts/${urlParams.contractId}/minimum-billings/${urlParams.minimumBillingId}`,
      data,
      'API_CONTRACT'
    );
  }

  deleteMinimumBilling (urlParams) {
    return this.requestService.doDELETE(
      `/api/contracts/${urlParams.contractId}/minimum-billings/${urlParams.minimumBillingId}`,
      'API_CONTRACT'
    );
  }
  /* End Minimum Billing */

  getAllDocumentsForContract (urlParams) {
    return this.requestService.doGET(
      `/api/contracts/${urlParams.contractId}/documents`,
      'API_CONTRACT'
    );
  }
}
