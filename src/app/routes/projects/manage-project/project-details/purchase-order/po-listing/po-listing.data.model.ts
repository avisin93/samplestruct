import { DatePickerMethods, Common } from '../../../../../../common';
import { PAYMENT_APPROVAL_CONSTANTS } from '../purchase-order.constants';

export class ManagePOListData {
  /**
   * method to get purchase order list data
  return poListData as array of object as per list data structure
  @param poList as array of Object
  */


  static getPOListDetails(poList: any) {
    const poListData = [];
    if (poList && poList.length > 0) {
      for (let i = 0; i < poList.length; i++) {
        const dataObj = poList[i];
        let paymentDate;
        let orderDate;
        if (dataObj.paymentDate) {
          paymentDate = DatePickerMethods.getDateWithTimezoneAdding(dataObj.paymentDate);
        }
        if (dataObj.orderDate) {
          orderDate = dataObj.orderDate;
        }
        const poObj = {
          'id': dataObj.id ? dataObj.id : '',
          'purchaseOrderFor': dataObj.purchaseOrderFor ? dataObj.purchaseOrderFor : 0,
          'supplierType': dataObj.supplierType ? dataObj.supplierType : 0,
          'supplierName': (dataObj.i18n && dataObj.i18n.name) ? dataObj.i18n.name : '',
          'consecutiveNumber': dataObj.consecutiveNumber ? dataObj.consecutiveNumber : '',
          'purchaseOrderNumber': dataObj.purchaseOrderNumber ? dataObj.purchaseOrderNumber : '',
          'canRaiseInvoice': dataObj.canRaiseInvoice ? dataObj.canRaiseInvoice : false,
          'canEdit': dataObj.canEdit ? dataObj.canEdit : false,
          'canSettle': dataObj.canSettle ? dataObj.canSettle : false,
          'settlementId': (dataObj.advancePurchaseOrder && dataObj.advancePurchaseOrder.poSettlementId) ? dataObj.advancePurchaseOrder.poSettlementId : '',
          'settlementStatus': (dataObj.advancePurchaseOrder && dataObj.advancePurchaseOrder.poSettlementStatus) ? dataObj.advancePurchaseOrder.poSettlementStatus : '',
          'ownPo': dataObj.ownPo ? dataObj.ownPo : false,
          'orderDate': orderDate ? orderDate : '',
          'createdBy': (dataObj.createdBy && dataObj.createdBy.name) ? dataObj.createdBy.name : '',
          'paymentDate': paymentDate ? paymentDate : '',
          'purchaseOrderFileUrl': (dataObj.purchaseOrderFile && dataObj.purchaseOrderFile.url) ? dataObj.purchaseOrderFile.url : '',
          'projectContractFileUrl': (dataObj.projectContract && dataObj.projectContract.fileUrl) ? dataObj.projectContract.fileUrl : '',
          'defaultCurrencyAmount': dataObj.defaultCurrencyAmount ? dataObj.defaultCurrencyAmount : '',
          'totalAmount': (dataObj.totalAmount || dataObj.totalAmount === 0) ? dataObj.totalAmount : '',
          'status': dataObj.status ? dataObj.status : 0,
          'currencyCode': dataObj.currencyCode ? dataObj.currencyCode : '',
          'thirdPartyVendorName': (dataObj.thirdPartyVendor && dataObj.thirdPartyVendor.name) ? dataObj.thirdPartyVendor.name : '',
          'approverId': (dataObj.approver && dataObj.approver.approverUserId) ? dataObj.approver.approverUserId : '',
          'approverName': (dataObj.approver && dataObj.approver.i18n && dataObj.approver.i18n.name) ? dataObj.approver.i18n.name : '',
          'approverRole': (dataObj.approver && dataObj.approver.approverRoleName) ? dataObj.approver.approverRoleName : '',
          'approverStatus': (dataObj.approver && dataObj.approver.status) ? dataObj.approver.status : 0,
          'approvalList': (dataObj.approvalList && dataObj.approvalList.length > 0) ? ManagePOListData.getApprovalHierarchyData(dataObj.approvalList) : [],
          'paymentsApprovalList': (dataObj.paymentsApprovalList && dataObj.paymentsApprovalList.length > 0) ? ManagePOListData.getApprovalHierarchyData(dataObj.paymentsApprovalList) : [],
          'paymentStatus': (dataObj.paymentStatus && dataObj.paymentStatus === PAYMENT_APPROVAL_CONSTANTS.overdue) ?
            PAYMENT_APPROVAL_CONSTANTS.scheduled : ((dataObj.paymentStatus || (dataObj.paymentStatus == PAYMENT_APPROVAL_CONSTANTS.scheduled)) ? dataObj.paymentStatus : ''),
          'paymentRejectReason': dataObj.paymentRejectReason ? dataObj.paymentRejectReason : '',
          'approver': dataObj.approver ? dataObj.approver : '',
          'palAccepted': (dataObj.projectContract && dataObj.projectContract.acceptTerms) ? dataObj.projectContract.acceptTerms : false,      
          'contractAccepted': dataObj.contractAcceptance ? dataObj.contractAcceptance : false
        };
        poListData.push(poObj);
      }


    }
    return poListData;
  }
  /**
  * method to get approval hierarchy array
  return poListData as array of object as per list data structure
  @param poList as array of Object
  */
  public static getApprovalHierarchyData(poApprovalHierarchyData) {
    const approvalHierarchyArr = [];
    for (let i = 0; i < poApprovalHierarchyData.length; i++) {
      const dataObj = poApprovalHierarchyData[i];
      const approvalHierarchyObj = {
        'approverName': (dataObj && dataObj.i18n && dataObj.i18n.name) ? dataObj.i18n.name : '',
        'approverRole': (dataObj && dataObj.approverRoleName) ? dataObj.approverRoleName : '',
        'status': (dataObj && dataObj.status) ? dataObj.status : 0
      };
      approvalHierarchyArr.push(approvalHierarchyObj);
    }
    return approvalHierarchyArr;
  }


  static setApprovalData(data: any, reasonList) {
    let approverData;

    approverData = {
      'approverRoleId': data.approverRoleId,
      'approverUserId': data.approverUserId,
      'level': data.level,
      'reasons': reasonList
    };
    return approverData;
  }
}
