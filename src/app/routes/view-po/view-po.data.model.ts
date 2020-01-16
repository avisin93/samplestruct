import { Common, DatePickerMethods } from '../../common';
import { PAYMENT_FOR, CFDI_CONST } from '../../config/constants';

export class ViewPOData {

  /**
   * setWebServiceDetails method use to set values of form to dada model
   * @param  PODetails as object which contain PO details of particular Id
   * which get from webservice
   * @return           FormData      as object
   */
  static setWebServiceDetails(PODetails: any) {
    let FormData;
    // let paymentDate;
    if (PODetails) {
      //   if (PODetails.paymentDate) {
      //     const payment = Common.removeOffsetFromUTC(PODetails.paymentDate);
      //     paymentDate = Common.getDateObjData(payment);
      //   }
      FormData = {
        // 'shootingDays':  PODetails.shootingDays ? parseInt(PODetails.shootingDays) : 0,

        'companyLogoUrl': (PODetails.company && PODetails.company.companyLogoUrl) ? PODetails.company.companyLogoUrl : '',
        // tslint:disable-next-line:max-line-length
        'companyName': (PODetails.company && PODetails.company.i18n && PODetails.company.i18n.name) ? PODetails.company.i18n.name : '',
        // tslint:disable-next-line:max-line-length
        'companyAddressLine1': (PODetails.company && PODetails.company.i18n && PODetails.company.i18n.addressLine1) ? PODetails.company.i18n.addressLine1 : '',
        // tslint:disable-next-line:max-line-length
        'companyAddressLine2': (PODetails.company && PODetails.company.i18n && PODetails.company.i18n.addressLine2) ? PODetails.company.i18n.addressLine2 : '',
        'companyPhoneNo': (PODetails.company && PODetails.company.phoneNumber) ? PODetails.company.phoneNumber : '',
        'comanyTaxId': (PODetails.company && PODetails.company.taxId) ? PODetails.company.taxId : '',
        'companyWebsite': (PODetails.company && PODetails.company.website) ? PODetails.company.website : '',
        'projectId': (PODetails.project && PODetails.project.id) ? PODetails.project.id : '',
        'projectName': (PODetails.project && PODetails.project.projectName) ? PODetails.project.projectName : '',
        'jobNumber': (PODetails.company && PODetails.project.jobNumber) ? PODetails.project.jobNumber : '',
        'purchaseOrderId': (PODetails.purchaseOrder && PODetails.purchaseOrder.id) ? PODetails.purchaseOrder.id : '',
        // tslint:disable-next-line:max-line-length
        'purchaseOrderNumber': (PODetails.purchaseOrder && PODetails.purchaseOrder.purchaseOrderNumber) ? PODetails.purchaseOrder.purchaseOrderNumber : '',
        // tslint:disable-next-line:max-line-length
        'purchaseOrderFor': (PODetails.purchaseOrder && (PODetails.purchaseOrder.purchaseOrderFor || PODetails.purchaseOrder.purchaseOrderFor === 0)) ? PODetails.purchaseOrder.purchaseOrderFor : '',
        // tslint:disable-next-line:max-line-length
        'supplierType': (PODetails.purchaseOrder && (PODetails.purchaseOrder.supplierType || PODetails.purchaseOrder.supplierType === 0)) ? PODetails.purchaseOrder.supplierType : '',
        'budgetName': (PODetails.budgetType && PODetails.budgetType.name) ? PODetails.budgetType.name : '',
        // tslint:disable-next-line:max-line-length
        'purchaseOrderDate': (PODetails.purchaseOrder && PODetails.purchaseOrder.orderDate) ? PODetails.purchaseOrder.orderDate : '',
        // tslint:disable-next-line:max-line-length
        'currencyCode': (PODetails.purchaseOrder && PODetails.purchaseOrder.currencyCode) ? PODetails.purchaseOrder.currencyCode : '',
        'vendorId': (PODetails.purchaseOrder && PODetails.purchaseOrder.vendorId) ? PODetails.purchaseOrder.vendorId : '',
        // tslint:disable-next-line:max-line-length
        'freelancerId': (PODetails.purchaseOrder && PODetails.purchaseOrder.freelancerId) ? PODetails.purchaseOrder.freelancerId : '',
        // tslint:disable-next-line:max-line-length
        'locationId': (PODetails.purchaseOrder && PODetails.purchaseOrder.locationId) ? PODetails.purchaseOrder.locationId : '',
        // tslint:disable-next-line:max-line-length
        'Id': (PODetails.purchaseOrder && PODetails.purchaseOrder.Id) ? PODetails.purchaseOrder.Id : '',
        // tslint:disable-next-line:max-line-length
        'currencyId': (PODetails.purchaseOrder && PODetails.purchaseOrder.currencyId) ? PODetails.purchaseOrder.currencyId : '',
        // tslint:disable-next-line:max-line-length
        'paymentDate': (PODetails.purchaseOrder && PODetails.purchaseOrder.paymentDate) ? ViewPOData.getDisplayDate(PODetails.purchaseOrder.paymentDate) : '',
        // tslint:disable-next-line:max-line-length
        'percentISRWithholding': (PODetails.purchaseOrder && PODetails.purchaseOrder.percentISRWithholding) ? PODetails.purchaseOrder.percentISRWithholding : '',
        // tslint:disable-next-line:max-line-length
        'percentVATWithholding': (PODetails.purchaseOrder && PODetails.purchaseOrder.percentVATWithholding) ? PODetails.purchaseOrder.percentVATWithholding : '',
        // tslint:disable-next-line:max-line-length
        'percentVAT': (PODetails.purchaseOrder && PODetails.purchaseOrder.percentVAT) ? PODetails.purchaseOrder.percentVAT : '',
        // tslint:disable-next-line:max-line-length
        'purchaseOrderForName': (PODetails.purchaseOrder && PODetails.purchaseOrder.i18n && PODetails.purchaseOrder.i18n.name) ? PODetails.purchaseOrder.i18n.name : '',
        // tslint:disable-next-line:max-line-length
        'purchaseOrderForaddress': (PODetails.purchaseOrder && PODetails.purchaseOrder.i18n && PODetails.purchaseOrder.i18n.address) ? PODetails.purchaseOrder.i18n.address : '',
        // tslint:disable-next-line:max-line-length
        'phoneNumber': (PODetails.purchaseOrder && PODetails.purchaseOrder.phoneNumber) ? PODetails.purchaseOrder.phoneNumber : '',
        // tslint:disable-next-line:max-line-length
        'notes': (PODetails.purchaseOrder && PODetails.purchaseOrder.i18n && PODetails.purchaseOrder.i18n.notes) ? PODetails.purchaseOrder.i18n.notes : '',
        // tslint:disable-next-line:max-line-length
        'thirdPartyVendor': (PODetails.purchaseOrder && PODetails.purchaseOrder.thirdPartyVendor) ? PODetails.purchaseOrder.thirdPartyVendor : '',
        // tslint:disable-next-line:max-line-length
        'thirdPartyVendorName': (PODetails.purchaseOrder && PODetails.purchaseOrder.thirdPartyVendor && PODetails.purchaseOrder.thirdPartyVendor.name) ? PODetails.purchaseOrder.thirdPartyVendor.name : '',
        // tslint:disable-next-line:max-line-length
        'bankAccountNumber': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.accountNumber) ? PODetails.purchaseOrder.bankDetails.accountNumber : '',
        // tslint:disable-next-line:max-line-length
        'bankName': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.bankName) ? PODetails.purchaseOrder.bankDetails.bankName : '',
        // tslint:disable-next-line:max-line-length
        'branchName': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.branch) ? PODetails.purchaseOrder.bankDetails.branch : '',
        // tslint:disable-next-line:max-line-length
        'BankAccountName': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.accountName) ? PODetails.purchaseOrder.bankDetails.accountName : '',
        // tslint:disable-next-line:max-line-length
        'rfcCode': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.rfcCode) ? PODetails.purchaseOrder.bankDetails.rfcCode : ((PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.taxId) ? PODetails.purchaseOrder.bankDetails.taxId : ''),
        // tslint:disable-next-line:max-line-length
        'taxId': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.taxId) ? PODetails.purchaseOrder.bankDetails.taxId : '',
        // tslint:disable-next-line:max-line-length
        'sortCode': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.sortCode) ? PODetails.purchaseOrder.bankDetails.sortCode : '',
        // tslint:disable-next-line:max-line-length
        'bankAddress': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.address) ? PODetails.purchaseOrder.bankDetails.address : '',
        // tslint:disable-next-line:max-line-length
        'clabe': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.clabe) ? PODetails.purchaseOrder.bankDetails.clabe : '',
        // tslint:disable-next-line:max-line-length
        'abaCode': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.abaCode) ? PODetails.purchaseOrder.bankDetails.abaCode : '',
        // tslint:disable-next-line:max-line-length
        'swiftCode': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.swiftCode) ? PODetails.purchaseOrder.bankDetails.swiftCode : '',
        // tslint:disable-next-line:max-line-length
        'totalAmountRequested': (PODetails.purchaseOrder && PODetails.purchaseOrder.totalAmountRequested) ? parseFloat(PODetails.purchaseOrder.totalAmountRequested) : 0,
        // tslint:disable-next-line:max-line-length
        'modeofOperationId': (PODetails.purchaseOrder && PODetails.purchaseOrder.modeofOperation && PODetails.purchaseOrder.modeofOperation.id) ? PODetails.purchaseOrder.modeofOperation.id : '',
        // tslint:disable-next-line:max-line-length
        'modeofOperationName': (PODetails.purchaseOrder && PODetails.purchaseOrder.modeofOperation && PODetails.purchaseOrder.modeofOperation.i18n && PODetails.purchaseOrder.modeofOperation.i18n.name) ? PODetails.purchaseOrder.modeofOperation.i18n.name : '',
        // tslint:disable-next-line:max-line-length
        'BudgetLineInfo': (PODetails.purchaseOrder && PODetails.purchaseOrder.services) ? PODetails.purchaseOrder.services : [],
        // tslint:disable-next-line:max-line-length
        'consecutiveNumber': (PODetails.purchaseOrder && PODetails.purchaseOrder.consecutiveNumber) ? PODetails.purchaseOrder.consecutiveNumber : '',
        // tslint:disable-next-line:max-line-length
        'cfdiType': (PODetails.purchaseOrder.cfdiType || PODetails.purchaseOrder.cfdiType == 0) ? PODetails.purchaseOrder.cfdiType : '',
        // tslint:disable-next-line:max-line-length
        'paymentType': (PODetails.purchaseOrder && PODetails.purchaseOrder.bankDetails && PODetails.purchaseOrder.bankDetails.paymentType) ? PODetails.purchaseOrder.bankDetails.paymentType : 0,
        'percentAgencyFee': (PODetails.purchaseOrder && PODetails.purchaseOrder.percentAgencyFee) ? PODetails.purchaseOrder.percentAgencyFee : 0,
        'percentMarkup': (PODetails.purchaseOrder && PODetails.purchaseOrder.percentMarkup) ? PODetails.purchaseOrder.percentMarkup : 0,
        'iva': (PODetails.purchaseOrder && PODetails.purchaseOrder.percentIVA) ? PODetails.purchaseOrder.percentIVA : 0
      };


      // tslint:disable-next-line:max-line-length
      if (FormData['clabe'] || ( FormData['purchaseOrderFor'] != PAYMENT_FOR.location && FormData['supplierType'] == PAYMENT_FOR.freelancer) || (((FormData['supplierType'] == PAYMENT_FOR.vendor) || (FormData['thirdPartyVendor'])) && FormData['paymentType'] ==  1)) {
        FormData['clabe'] = FormData['clabe'] ? FormData['clabe'] : '-';
        if (FormData['thirdPartyVendor'] && FormData['paymentType'] !=  1) {
          FormData['clabe'] = "";
        }
        
      }

      // tslint:disable-next-line:max-line-length
      if (FormData['sortCode'] || (((FormData['supplierType'] == PAYMENT_FOR.vendor) || (FormData['thirdPartyVendor'])) && FormData['paymentType'] ==  1)) {
        FormData['sortCode'] = FormData['sortCode'] ? FormData['sortCode'] : '-';
      }

      // tslint:disable-next-line:max-line-length
      if (FormData['swiftCode'] || (((FormData['supplierType'] == PAYMENT_FOR.vendor) || (FormData['thirdPartyVendor'])) && FormData['paymentType'] ==  2)) {
        FormData['swiftCode'] = FormData['swiftCode'] ? FormData['swiftCode'] : '-';
      }

      if (FormData['abaCode'] || (((FormData['supplierType'] == PAYMENT_FOR.vendor) || (FormData['thirdPartyVendor'])) && FormData['paymentType'] ==  2)) {
        FormData['abaCode'] = FormData['abaCode'] ? FormData['abaCode'] : '-';
      }


      for (let i = 0; i < FormData.BudgetLineInfo.length; i++) {
        if (FormData.BudgetLineInfo[i].quantity) {
          // tslint:disable-next-line:max-line-length
          FormData.BudgetLineInfo[i].totalAmount = parseFloat(FormData.BudgetLineInfo[i].amount) * parseFloat(FormData.BudgetLineInfo[i].quantity);
        } else if (FormData.BudgetLineInfo[i].amount) {
          FormData.BudgetLineInfo[i].totalAmount = FormData.BudgetLineInfo[i].amount;
        } else {
          FormData.BudgetLineInfo[i].totalAmount = FormData.totalAmountRequested;
          FormData.BudgetLineInfo[i].amount = FormData.totalAmountRequested;
        }
      }
    }
    return FormData;
  }

  static getDisplayDate(dateReceived) {
    const date = DatePickerMethods.getDateWithTimezoneAdding(dateReceived);
    return date;
  }

}
