import { BidData } from "./manage-bid";
import { ManageBasicInfoData } from "./basic-info/basic-info.data.model";
import { TalentData } from './talent-info/talent-info.data.model';
import { EditingAndPostDataModel } from './editing-and-post/editing-and-post.data.model';
import { ManageBusinessTermData } from './business-terms/business-terms.data.model';
import { ManageProductionParametersData } from "./production-parameters/production-parameters.data.model";
import { TAB_CONST } from "../Constants";

export class ManageBid {

    static getWebServiceDetails(tabId, data: BidData) {
        const bidDataObj = new BidData();
        let moduleKey = "";
        switch (tabId) {
            case TAB_CONST.basicInfo:
                bidDataObj.basicInfo = ManageBasicInfoData.getWebServiceDetails(data.basicInfo);
                bidDataObj['editingAndPost'] = EditingAndPostDataModel.getWebserviceDetails(data['editingAndPost']);
                moduleKey = "basicInfo";
                break;
            case TAB_CONST.businessTerms:
                bidDataObj['businessTerms'] = ManageBusinessTermData.getWebServiceDetails(data['businessTerms']);
                moduleKey = "businessTerms";
                break;
            case TAB_CONST.productionParameters:
                bidDataObj.productionParameters = ManageProductionParametersData.getWebServiceDetails(data.productionParameters);
                moduleKey = "productionParameters";
                break;
            case TAB_CONST.talent:
                bidDataObj['talent'] = TalentData.getTalentDetails(data['talent']);
                moduleKey = "talent";
                break;
            case TAB_CONST.editingAndPost:
                bidDataObj['editingAndPost'] = EditingAndPostDataModel.getWebserviceDetails(data['editingAndPost']);
                moduleKey = "editingAndPost";
                break;
        }

        const finalBidDetails = {
            key: moduleKey,
            details: bidDataObj
        };

        return finalBidDetails;
    }


}
