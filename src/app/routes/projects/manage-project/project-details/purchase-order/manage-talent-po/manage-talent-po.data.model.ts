// import { ROUTER_LINKS, PROJECT_TYPES } from '../../../../../config';
import { Common } from '../../../../../../common';
import { TALENT_TYPES, PURCHASE_ORDER_TYPE } from '@app/config';

export class ManageTalentPoDataModel {
    static TALENT_TYPES_OBJ: any = Common.keyValueDropdownArr(TALENT_TYPES, 'text', 'id');
    /**
    return Role details data as per formcontrol
    @param projectDetails as Object
    **/
    static getFormDetails(poDetails: any) {
        let poFormData;
        if (poDetails) {
            let paymentDate;
            if (poDetails.paymentDate) {
                const date = Common.removeOffsetFromUTC(poDetails.paymentDate);
                paymentDate = Common.getDateObjData(date);
            }
            const agencyDetails = poDetails.agency ? poDetails.agency : {};
            const individualDetails = poDetails.individual ? poDetails.individual : {};
            poFormData = {
                talentType: poDetails.talentPoFor ? poDetails.talentPoFor : ManageTalentPoDataModel.TALENT_TYPES_OBJ.agency,
                budgetLine: (poDetails.budgetLine && poDetails.budgetLine.projectBudgetConfigurationId) ? poDetails.budgetLine.projectBudgetConfigurationId : '',
                itemDescription: (poDetails.budgetLine && poDetails.budgetLine.itemDescription) ? poDetails.budgetLine.itemDescription : '',
                modeOfOperation: poDetails.operationId ? poDetails.operationId : '',
                agency: agencyDetails.id ? agencyDetails.id : '',
                agencyName: (agencyDetails.i18n && agencyDetails.i18n.name) ? agencyDetails.i18n.name : '',
                talent: individualDetails.id ? individualDetails.id : '',
                talentName: (individualDetails.i18n && individualDetails.i18n.name) ? individualDetails.i18n.name : '',
                currencyId: poDetails.currencyId ? poDetails.currencyId : '',
                service: poDetails.serviceId ? poDetails.serviceId : '',
                category: poDetails.categoryIds ? poDetails.categoryIds : '',
                role: poDetails.talentRoleIds ? poDetails.talentRoleIds : '',
                media: (poDetails.mediaIds.length > 0) ? ManageTalentPoDataModel.getMediaIds(poDetails.mediaIds) : [],
                territory: poDetails.territoryIds ? poDetails.territoryIds : '',
                years: poDetails.years ? poDetails.years : 0,
                months: poDetails.months ? poDetails.months : 0,
                weeks: poDetails.weeks ? poDetails.weeks : 0,
                termsSelected: (poDetails.years || poDetails.months || poDetails.weeks) ? true : false,
                amount: poDetails.totalAmountRequested ? poDetails.totalAmountRequested : 0,
                agencyFee: (poDetails.percentAgencyFee || poDetails.percentAgencyFee === 0) ? poDetails.percentAgencyFee : 0,
                markup: (poDetails.percentMarkup || poDetails.percentMarkup === 0) ? poDetails.percentMarkup : 0,
                notes: (poDetails.i18n && poDetails.i18n.notes) ? poDetails.i18n.notes : '',
                paymentDate: paymentDate ? paymentDate : '',
                iva: (poDetails.percentIVA || poDetails.percentIVA === 0) ? poDetails.percentIVA : 0

            };

        }
        return poFormData;
    }
    static getWebServiceDetails(poDetails: any) {
        let poFormData;
        let paymentDate;
        if (poDetails) {
            if (poDetails.paymentDate) {
                const obj = Common.setOffsetToUTC(poDetails.paymentDate, '');
                paymentDate = obj['fromDate'];
            }
            poFormData = {
                i18n: {
                    'langCode': poDetails.langCode ? poDetails.langCode : '',
                    'notes': poDetails.notes ? poDetails.notes : '',
                },
                talentPoFor: poDetails.talentType ? poDetails.talentType : ManageTalentPoDataModel.TALENT_TYPES_OBJ.agency,
                budgetLine: {
                    itemDescription: poDetails.itemDescription ? poDetails.itemDescription : '',
                    projectBudgetConfigurationId: poDetails.budgetLine ? poDetails.budgetLine : ''
                },
                operationId: poDetails.modeOfOperation ? poDetails.modeOfOperation : '',
                agencyId: poDetails.agency ? poDetails.agency : '',
                individualId: poDetails.talent ? poDetails.talent : '',
                currencyId: poDetails.currencyId ? poDetails.currencyId : '',
                serviceId: poDetails.service ? poDetails.service : '',
                categoryIds: poDetails.category ? poDetails.category : [],
                talentRoleIds: poDetails.role ? poDetails.role : [],
                mediaIds: (poDetails.media.length > 0) ? ManageTalentPoDataModel.setMediaIds(poDetails.media) : [],
                territoryIds: poDetails.territory ? poDetails.territory : [],
                years: poDetails.years ? parseInt(poDetails.years) : 0,
                months: poDetails.months ? parseInt(poDetails.months) : 0,
                weeks: poDetails.weeks ? parseInt(poDetails.weeks) : 0,
                totalAmountRequested: poDetails.amount ? parseFloat(poDetails.amount) : '',
                percentAgencyFee: (poDetails.agencyFee || poDetails.agencyFee == 0) ? parseFloat(poDetails.agencyFee) : '',
                percentMarkup: (poDetails.markup || poDetails.markup == 0) ? parseFloat(poDetails.markup) : '',
                paymentDate: paymentDate ? paymentDate : '',
                purchaseOrderFor: PURCHASE_ORDER_TYPE.talent,
                percentIVA: (poDetails.iva || poDetails.iva == 0) ? parseFloat(poDetails.iva) : ''
            };

        }
        return poFormData;
    }
    static setMediaIds(mediaArr) {
        const dataArr = [];
        mediaArr.forEach((obj) => {
            const mediaObj = {
                id: obj.childId,
                parentId: obj.parentId,
            };
            dataArr.push(mediaObj);
        });
        return dataArr;
    }
    static getMediaIds(mediaArr) {
        const dataArr = [];
        mediaArr.forEach((obj) => {
            const mediaObj = {
                childId: obj.id,
                parentId: obj.parentId
            };
            dataArr.push(mediaObj);
        });
        return dataArr;
    }
}
