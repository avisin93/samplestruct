

export class ManageBasicInfoData {
    /**
    return Role details data as per formcontrol
    @param basicInfoDetails as Object
    **/
    static getFormDetails(basicInfoDetails: any) {
        let basicInfoData;
        if (basicInfoDetails) {
            let commercialObj = basicInfoDetails.commercial ? basicInfoDetails.commercial : {};
            let brandObj = commercialObj.brand ? commercialObj.brand : {};
            let clientObj = basicInfoDetails.client ? basicInfoDetails.client : {};
            let agencyObj = commercialObj.agency ? commercialObj.agency : {};
            let productionCompanyObj = commercialObj.intlProductionCompany ? commercialObj.intlProductionCompany : {};
            let biddingProducerObj = basicInfoDetails.biddingProducer ? basicInfoDetails.biddingProducer : {};
            if (basicInfoDetails) {
                basicInfoData = {
                    "projectName": basicInfoDetails.projectName ? basicInfoDetails.projectName : '',
                    "jobNumber": basicInfoDetails.jobNumber ? basicInfoDetails.jobNumber : '',
                    "shootingLocation": basicInfoDetails.shootingLocation ? basicInfoDetails.shootingLocation : '',
                    'brand': {
                        'name': brandObj.name ? brandObj.name : '',
                        'logoId': brandObj.iconFileId ? brandObj.iconFileId : '',
                        'logoUrl': brandObj.iconUrl ? brandObj.iconUrl : '',
                        'showLoader': false
                    },
                    'client': {
                        'name': clientObj.clientName ? clientObj.clientName : '',
                        'logoId': clientObj.iconFileId ? clientObj.iconFileId : '',
                        'logoUrl': clientObj.iconUrl ? clientObj.iconUrl : '',
                        'showLoader': false
                    },
                    'agency': {
                        'name': agencyObj.name ? agencyObj.name : '',
                        'logoId': agencyObj.iconFileId ? agencyObj.iconFileId : '',
                        'logoUrl': agencyObj.iconUrl ? agencyObj.iconUrl : '',
                        'showLoader': false,
                        'creative': agencyObj.creative ? agencyObj.creative : '',
                        'agencyProducer': agencyObj.agencyProducer ? agencyObj.agencyProducer : '',
                        'accounts': agencyObj.accounts ? agencyObj.accounts : '',
                        'visitingCrew': (agencyObj.vistingCrew || agencyObj.vistingCrew === 0) ? agencyObj.vistingCrew : ''
                    },
                    'productionCompany': {
                        'name': productionCompanyObj.name ? productionCompanyObj.name : '',
                        'logoId': productionCompanyObj.iconFileId ? productionCompanyObj.iconFileId : '',
                        'logoUrl': productionCompanyObj.iconUrl ? productionCompanyObj.iconUrl : '',
                        'showLoader': false,
                        'address': productionCompanyObj.address ? productionCompanyObj.address : '',
                        'telephone': productionCompanyObj.telephone ? productionCompanyObj.telephone : '',
                        'website': productionCompanyObj.url ? productionCompanyObj.url : ''
                    },
                    'biddingProducer': {
                        'name': biddingProducerObj.biddingProducerName ? biddingProducerObj.biddingProducerName : '',
                        'email': biddingProducerObj.email ? biddingProducerObj.email : '',
                        'mobile': biddingProducerObj.mobile ? biddingProducerObj.mobile : ''
                    },
                    "director": basicInfoDetails.director ? basicInfoDetails.director : '',
                    "dp": basicInfoDetails.directorOfPhotography ? basicInfoDetails.directorOfPhotography : '',
                    "commercialTitle": basicInfoDetails.commercialTitle ? ManageBasicInfoData.getCommercialTitles(basicInfoDetails.commercialTitle) : []

                };

            }
        }
        return basicInfoData;
    }
    static getCommercialTitles(data) {
        let commercialTitlesArr = [];
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                let temDataObj = data[index];
                commercialTitlesArr.push({
                    "title": temDataObj.title ? temDataObj.title : ""
                });
            }
        } else {
            commercialTitlesArr.push({
                "title": ""
            });
        }

        return commercialTitlesArr;
    }
    static setCommercialTitles(data) {
        let commercialTitlesArr = [];
        for (let index = 0; index < data.length; index++) {
            let temDataObj = data[index];
            if (temDataObj.title) {
                commercialTitlesArr.push({
                    "title": temDataObj.title ? temDataObj.title : ""
                });
            }
        }
        return commercialTitlesArr;
    }
    static getWebServiceDetails(basicInfoDetails: any) {
        let basicInfoData;
        let brandObj = basicInfoDetails.brand ? basicInfoDetails.brand : {};
        let clientObj = basicInfoDetails.client ? basicInfoDetails.client : {};
        let agencyObj = basicInfoDetails.agency ? basicInfoDetails.agency : {};
        let productionCompanyObj = basicInfoDetails.productionCompany ? basicInfoDetails.productionCompany : {};
        let biddingProducerObj = basicInfoDetails.biddingProducer ? basicInfoDetails.biddingProducer : {};
        if (basicInfoDetails) {
            basicInfoData = {
                "projectName": basicInfoDetails.projectName ? basicInfoDetails.projectName : '',
                "director": basicInfoDetails.director ? basicInfoDetails.director : '',
                "directorOfPhotography": basicInfoDetails.dp ? basicInfoDetails.dp : '',
                "jobNumber": basicInfoDetails.jobNumber ? basicInfoDetails.jobNumber : '',
                "shootingLocation": basicInfoDetails.shootingLocation ? basicInfoDetails.shootingLocation : '',
                'client': {
                    'clientName': clientObj.name ? clientObj.name : '',
                    'iconFileId': clientObj.logoId ? clientObj.logoId : ''
                },
                "commercial": {
                    'brand': {
                        'name': brandObj.name ? brandObj.name : '',
                        'iconFileId': brandObj.logoId ? brandObj.logoId : ''
                    },

                    'agency': {
                        'name': agencyObj.name ? agencyObj.name : '',
                        'iconFileId': agencyObj.logoId ? agencyObj.logoId : '',
                        'creative': agencyObj.creative ? agencyObj.creative : '',
                        'agencyProducer': agencyObj.agencyProducer ? agencyObj.agencyProducer : '',
                        'accounts': agencyObj.accounts ? agencyObj.accounts : '',
                        'vistingCrew': (agencyObj.visitingCrew || agencyObj.visitingCrew === 0) ? agencyObj.visitingCrew : ''
                    },
                    'intlProductionCompany': {
                        'name': productionCompanyObj.name ? productionCompanyObj.name : '',
                        'iconFileId': productionCompanyObj.logoId ? productionCompanyObj.logoId : '',
                        'address': productionCompanyObj.address ? productionCompanyObj.address : '',
                        'telephone': productionCompanyObj.telephone ? productionCompanyObj.telephone : '',
                        'url': productionCompanyObj.website ? productionCompanyObj.website : ''
                    },
                },
                'biddingProducer': {
                    'biddingProducerName': biddingProducerObj.name ? biddingProducerObj.name : '',
                    'email': biddingProducerObj.email ? biddingProducerObj.email : '',
                    'mobile': biddingProducerObj.mobile ? biddingProducerObj.mobile : ''
                },
                "commercialTitle": (basicInfoDetails.commercialTitle && basicInfoDetails.commercialTitle.length > 0) ? ManageBasicInfoData.setCommercialTitles(basicInfoDetails.commercialTitle) : []

            };

        }
        return basicInfoData;
    }
}
