import { Common, DatePickerMethods } from '../../common';

export class ViewInvoiceData {

  /**
   *  method  to get PO details object as per ui data structure
   * @param  poDetails as PO details object as per backend structure 
   * @return  formData as PO details object as per ui data structure
   */
  static getPOWebServiceDetails(poDetails: any) {
    let formData;
    let companyDetails;
    let purchaseOrderDetails;
    companyDetails = poDetails.company ? poDetails.company : {};
    purchaseOrderDetails = poDetails.purchaseOrder ? poDetails.purchaseOrder : {};
    if (poDetails) {
      formData = {
        'companyLogoUrl': companyDetails.companyLogoUrl ? companyDetails.companyLogoUrl : '',
        // tslint:disable-next-line:max-line-length
        'companyName': (companyDetails.i18n && companyDetails.i18n.name) ? companyDetails.i18n.name : '',
        // tslint:disable-next-line:max-line-length
        'companyAddressLine1': (companyDetails.i18n && companyDetails.i18n.addressLine1) ? companyDetails.i18n.addressLine1 : '',
        // tslint:disable-next-line:max-line-length
        'companyAddressLine2': (companyDetails.i18n && companyDetails.i18n.addressLine2) ? companyDetails.i18n.addressLine2 : '',
        'companyPhoneNo': companyDetails.phoneNumber ? companyDetails.phoneNumber : '',
        'comanyTaxId': companyDetails.taxId ? companyDetails.taxId : '',
        'companyWebsite': companyDetails.website ? companyDetails.website : '',
        'projectName': (poDetails.project && poDetails.project.projectName) ? poDetails.project.projectName : '',
        'budgetName': (poDetails.budgetType && poDetails.budgetType.name) ? poDetails.budgetType.name : '',
        // tslint:disable-next-line:max-line-length
        'purchaseOrderNumber': purchaseOrderDetails.purchaseOrderNumber ? purchaseOrderDetails.purchaseOrderNumber : '',
        // tslint:disable-next-line:max-line-length
        'purchaseOrderFor': (purchaseOrderDetails.purchaseOrderFor || (purchaseOrderDetails.purchaseOrderFor === 0)) ? purchaseOrderDetails.purchaseOrderFor : '',
        // tslint:disable-next-line:max-line-length
        'supplierType': (purchaseOrderDetails.supplierType || (purchaseOrderDetails.supplierType === 0)) ? purchaseOrderDetails.supplierType : '',
        // tslint:disable-next-line:max-line-length
        'purchaseOrderDate': purchaseOrderDetails.orderDate ? DatePickerMethods.getDateWithTimezoneAdding(purchaseOrderDetails.orderDate) : '',
        // tslint:disable-next-line:max-line-length
        'currencyCode': purchaseOrderDetails.currencyCode ? purchaseOrderDetails.currencyCode : '',
        'purchaseOrderForName': (purchaseOrderDetails.i18n && purchaseOrderDetails.i18n.name) ? purchaseOrderDetails.i18n.name : '',
        // tslint:disable-next-line:max-line-length
        'purchaseOrderForaddress': (purchaseOrderDetails.i18n && purchaseOrderDetails.i18n.address) ? purchaseOrderDetails.i18n.address : '',
        // tslint:disable-next-line:max-line-length
        'phoneNumber': purchaseOrderDetails.phoneNumber ? purchaseOrderDetails.phoneNumber : '',
        // tslint:disable-next-line:max-line-length
        'thirdPartyVendor': purchaseOrderDetails.thirdPartyVendor ? purchaseOrderDetails.thirdPartyVendor : '',
        // tslint:disable-next-line:max-line-length
        'taxId': (purchaseOrderDetails.bankDetails && purchaseOrderDetails.bankDetails.taxId) ? purchaseOrderDetails.bankDetails.taxId : '',
        'totalAmountRequested': purchaseOrderDetails.totalAmountRequested ? parseFloat(purchaseOrderDetails.totalAmountRequested) : 0,
        'budgetLineArr': purchaseOrderDetails.services ? purchaseOrderDetails.services : [],
        'cfdiType': (purchaseOrderDetails.cfdiType || purchaseOrderDetails.cfdiType == 0) ? purchaseOrderDetails.cfdiType : ''
      };

    }
    return formData;
  }

  /**
   *  method  to get invoice details object as per ui data structure
   * @param  invoiceDetails as invoice details object as per backend structure 
   * @return  invoiceData as invoice details object as per ui data structure
   */
  static getInvoiceWebServiceDetails(invoiceDetails: any) {
    let invoiceData;
    invoiceData = {

      'purchaseOrderId': invoiceDetails.purchaseOrderId ? invoiceDetails.purchaseOrderId : '',
      'invoiceDate': invoiceDetails.createdDate ? DatePickerMethods.getDateWithTimezoneAdding(invoiceDetails.createdDate) : '',
      'bankAccountNumber': invoiceDetails.accountNumber ? invoiceDetails.accountNumber : '',
      'invoiceNumber': invoiceDetails.invoiceNumber ? invoiceDetails.invoiceNumber : '',
      'bankName': invoiceDetails.bankName ? invoiceDetails.bankName : '',
      'branchName': invoiceDetails.branch ? invoiceDetails.branch : '',
      'bankAccountName': invoiceDetails.accountName ? invoiceDetails.accountName : '',
      'taxId': invoiceDetails.taxId ? invoiceDetails.taxId : '',
      'sortCode': invoiceDetails.sortCode ? invoiceDetails.sortCode : '',
      'address': invoiceDetails.address ? invoiceDetails.address : '',
      'clabe': invoiceDetails.clabe ? invoiceDetails.clabe : '',
      'abaCode': invoiceDetails.abaCode ? invoiceDetails.abaCode : '',
      'swiftCode': invoiceDetails.swiftCode ? invoiceDetails.swiftCode : '',
      'percentISRWithholding': invoiceDetails.percentISRWithholding ? invoiceDetails.percentISRWithholding : 0,
      'percentVATWithholding': invoiceDetails.percentVATWithholding ? invoiceDetails.percentVATWithholding : 0,
      'percentVAT': invoiceDetails.percentVAT ? invoiceDetails.percentVAT : 0,
      'invoiceAmount': invoiceDetails.invoiceAmount ? invoiceDetails.invoiceAmount : 0,
      'percentAgencyFee': invoiceDetails.percentAgencyFee ? invoiceDetails.percentAgencyFee : 0,
      'percentMarkup': invoiceDetails.percentMarkup ? invoiceDetails.percentMarkup : 0,
      'iva': invoiceDetails.percentIVA ? invoiceDetails.percentIVA : 0,
      'notes': (invoiceDetails.i18n && invoiceDetails.i18n.notes) ? invoiceDetails.i18n.notes : '',
    }
    return invoiceData;
  }
}
