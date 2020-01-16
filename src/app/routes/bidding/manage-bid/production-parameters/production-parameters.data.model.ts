import { DEFAULT_MASTER_CONFIG_CURRENCY } from "@app/config";

export class ManageProductionParametersData {
    /**
    return Role details data as per formcontrol
    @param productionParametersDetails as Object
    **/
    static getFormDetails(productionParametersDetails: any, defaultCurrencyId: string) {
        let productionParametersData;
        if (productionParametersDetails) {
            let locationsObj = productionParametersDetails.locations ? productionParametersDetails.locations : {};
            let wardrobeObj = productionParametersDetails.wardrobe ? productionParametersDetails.wardrobe : {};
            let artDepartmentObj = productionParametersDetails.artDepartment ? productionParametersDetails.artDepartment : {};
            let equipmentObj = productionParametersDetails.equipment ? productionParametersDetails.equipment : {};
            if (productionParametersDetails) {
                productionParametersData = {
                    'general': {
                        'locationShootDays': (productionParametersDetails.locationShootDays || productionParametersDetails.locationShootDays === 0) ? productionParametersDetails.locationShootDays : '',
                        'stageShootDays': (productionParametersDetails.stageShootDays || productionParametersDetails.stageShootDays === 0) ? productionParametersDetails.stageShootDays : '',
                        'overtime': (productionParametersDetails.overtime || productionParametersDetails.overtime === 0) ? productionParametersDetails.overtime : '',
                        'locationPrepDays': (productionParametersDetails.locationPrepDays || productionParametersDetails.locationPrepDays === 0) ? productionParametersDetails.locationPrepDays : '',
                        'locationPrelight': (productionParametersDetails.locationPreLight || productionParametersDetails.locationPreLight === 0) ? productionParametersDetails.locationPreLight : '',
                        'stagePrepDays': (productionParametersDetails.stagePrepDays || productionParametersDetails.stagePrepDays === 0) ? productionParametersDetails.stagePrepDays : '',
                        'stagePrelight': (productionParametersDetails.stagePreLight || productionParametersDetails.stagePreLight === 0) ? productionParametersDetails.stagePreLight : '',
                        'scoutingDays': (productionParametersDetails.scoutingDays || productionParametersDetails.scoutingDays === 0) ? productionParametersDetails.scoutingDays : '',
                        'directorScoutDays': (productionParametersDetails.directorScoutDays || productionParametersDetails.directorScoutDays === 0) ? productionParametersDetails.directorScoutDays : '',
                        'technicalScoutDays': (productionParametersDetails.technicalScoutDays || productionParametersDetails.technicalScoutDays === 0) ? productionParametersDetails.technicalScoutDays : '',
                        'travelDays': (productionParametersDetails.travelDays || productionParametersDetails.travelDays === 0) ? productionParametersDetails.travelDays : '',
                        'foreignCrewMembers': (productionParametersDetails.foreignCrewMembers || productionParametersDetails.foreignCrewMembers === 0) ? productionParametersDetails.foreignCrewMembers : '',
                        'foreignAgency': (productionParametersDetails.foreignAgencyMembers || productionParametersDetails.foreignAgencyMembers === 0) ? productionParametersDetails.foreignAgencyMembers : '',
                        'foreignClient': (productionParametersDetails.foreignClientMembers || productionParametersDetails.foreignClientMembers === 0) ? productionParametersDetails.foreignClientMembers : '',
                        'travelMileage': (productionParametersDetails.mileage && (productionParametersDetails.mileage.mileage || productionParametersDetails.mileage.mileage === 0)) ? productionParametersDetails.mileage.mileage : '',
                        'travelMileageUnit': (productionParametersDetails.mileage && productionParametersDetails.mileage.metric) ? productionParametersDetails.mileage.metric : ''
                    },
                    'locations': {
                        'interior': locationsObj.interior ? ManageProductionParametersData.getDataWithDays(locationsObj.interior, defaultCurrencyId) : [],
                        'exterior': locationsObj.exterior ? ManageProductionParametersData.getDataWithDays(locationsObj.exterior, defaultCurrencyId) : [],
                        'special': locationsObj.special ? ManageProductionParametersData.getDataWithDays(locationsObj.special, defaultCurrencyId) : [],
                        'cityPermits': locationsObj.cityPermits ? ManageProductionParametersData.getCityPermitsData(locationsObj.cityPermits) : []
                    },
                    'wardrobe': {
                        'pcCurrencyId': wardrobeObj.pcCurrencyId ? wardrobeObj.pcCurrencyId : defaultCurrencyId,
                        'principalCost': wardrobeObj.principalCost ? wardrobeObj.principalCost : '',
                        'fecCurrencyId': wardrobeObj.fecCurrencyId ? wardrobeObj.fecCurrencyId : defaultCurrencyId,
                        'featuredExtraCost': wardrobeObj.featuredExtraCost ? wardrobeObj.featuredExtraCost : '',
                        'ecCurrencyId': wardrobeObj.ecCurrencyId ? wardrobeObj.ecCurrencyId : defaultCurrencyId,
                        'extrasCost': wardrobeObj.extrasCost ? wardrobeObj.extrasCost : ''
                    },
                    'pictureVehicles': productionParametersDetails.pictureVehicles ? ManageProductionParametersData.getDataWithDays(productionParametersDetails.pictureVehicles, defaultCurrencyId) : [],
                    'carCareAndTransport': productionParametersDetails.carCareTransport ? ManageProductionParametersData.getDataWithDays(productionParametersDetails.carCareTransport, defaultCurrencyId) : [],
                    'specialEffects': productionParametersDetails.specialEffects ? ManageProductionParametersData.getDataWithoutDays(productionParametersDetails.specialEffects, defaultCurrencyId) : [],
                    'animals': productionParametersDetails.animals ? ManageProductionParametersData.getDataWithDays(productionParametersDetails.animals, defaultCurrencyId) : [],
                    'other1': productionParametersDetails.other1 ? ManageProductionParametersData.getDataWithDays(productionParametersDetails.other1, defaultCurrencyId) : [],
                    'other2': productionParametersDetails.other2 ? ManageProductionParametersData.getDataWithDays(productionParametersDetails.other2, defaultCurrencyId) : [],
                    'artDepartment': {
                        'setConstruction': artDepartmentObj.setConstruction ? ManageProductionParametersData.getDataWithoutDays(artDepartmentObj.setConstruction, defaultCurrencyId) : [],
                        // 'setDressing': (artDepartmentObj.setDressing && artDepartmentObj.setDressing.length > 0) ? ManageProductionParametersData.getDataWithoutDays(artDepartmentObj.setDressing) : [],
                        'streetSingingOthers': artDepartmentObj.setSigning ? ManageProductionParametersData.getDataWithoutName(artDepartmentObj.setSigning, defaultCurrencyId) : [],
                        'greens': artDepartmentObj.greens ? ManageProductionParametersData.getDataWithoutName(artDepartmentObj.greens, defaultCurrencyId) : [],
                        'specialManufactures': artDepartmentObj.specialManufacturers ? ManageProductionParametersData.getDataWithoutName(artDepartmentObj.specialManufacturers, defaultCurrencyId) : [],
                        'others': artDepartmentObj.others ? ManageProductionParametersData.getDataWithoutDays(artDepartmentObj.others, defaultCurrencyId) : []
                    },
                    'equipment': {
                        'cameras': (equipmentObj.camera || equipmentObj.camera === 0) ? equipmentObj.camera : '',
                        'lightiningNightShootEquipment': (equipmentObj.lightningNightShootEquipment || equipmentObj.lightningNightShootEquipment === 0) ? equipmentObj.lightningNightShootEquipment : '',
                        'cameraCar': (equipmentObj.cameraCar || equipmentObj.cameraCar === 0) ? equipmentObj.cameraCar : '',
                        'steadyCam': (equipmentObj.steadyCam || equipmentObj.steadyCam === 0) ? equipmentObj.steadyCam : '',
                        'crane': (equipmentObj.crane || equipmentObj.crane === 0) ? equipmentObj.crane : '',
                        'directSound': (equipmentObj.directSound || equipmentObj.directSound === 0) ? equipmentObj.directSound : ''
                    }
                };

            }
        }
        return productionParametersData;
    }
    static getCityPermitsData(data) {
        let cityPermitsArr = [];
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                let dataObj = data[index];
                let temDataObj = {
                    "permitType": dataObj.permitType ? dataObj.permitType : "",
                    "name": dataObj.name ? dataObj.name : "",
                    "days": (dataObj.days || dataObj.days === 0) ? dataObj.days : "",
                    "category": dataObj.category ? dataObj.category : "",
                    "invalidFlag": false
                };
                cityPermitsArr.push(temDataObj);
            }
        } else {
            let temDataObj = {
                "permitType": "",
                "name": "",
                "days": "",
                "category": "",
                "invalidFlag": false
            };
            cityPermitsArr.push(temDataObj);
        }
        return cityPermitsArr;
    }
    static setCityPermitsData(data) {
        let cityPermitsArr = [];
        for (let index = 0; index < data.length; index++) {
            let dataObj = data[index];
            if (dataObj.permitType && dataObj.name && (dataObj.days || dataObj.days === 0) && dataObj.category) {
                let temDataObj = {
                    "permitType": dataObj.permitType ? dataObj.permitType : "",
                    "name": dataObj.name ? dataObj.name : "",
                    "days": (dataObj.days || dataObj.days === 0) ? dataObj.days : "",
                    "category": dataObj.category ? dataObj.category : ""
                };
                cityPermitsArr.push(temDataObj);
            }
        }
        return cityPermitsArr;
    }
    static getDataWithDays(data, defaultCurrencyId) {
        let dataArr = [];
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                let dataObj = data[index];
                let temDataObj = {
                    "name": dataObj.name ? dataObj.name : "",
                    "days": (dataObj.days || dataObj.days === 0) ? dataObj.days : "",
                    "costPerDay": (dataObj.costPerDay || dataObj.costPerDay === 0) ? dataObj.costPerDay : "",
                    "currencyId": dataObj.currencyId ? dataObj.currencyId : defaultCurrencyId,
                    "invalidFlag": false
                };
                dataArr.push(temDataObj);
            }
        } else {
            let temDataObj = {
                "name": "",
                "days": "",
                "costPerDay": "",
                "currencyId": defaultCurrencyId,
                "invalidFlag": false
            };
            dataArr.push(temDataObj);
        }
        return dataArr;
    }
    static setDataWithDays(data) {
        let dataArr = [];
        for (let index = 0; index < data.length; index++) {
            let dataObj = data[index];
            if (dataObj.name && (dataObj.days || dataObj.days === 0) && (dataObj.costPerDay || dataObj.costPerDay === 0) && dataObj.currencyId) {
                let temDataObj = {
                    "name": dataObj.name ? dataObj.name : "",
                    "days": (dataObj.days || dataObj.days === 0) ? dataObj.days : "",
                    "costPerDay": (dataObj.costPerDay || dataObj.costPerDay === 0) ? dataObj.costPerDay : "",
                    "currencyId": dataObj.currencyId ? dataObj.currencyId : ""
                };
                dataArr.push(temDataObj);
            }
        }
        return dataArr;
    }
    static getDataWithoutDays(data, defaultCurrencyId) {
        let dataArr = [];
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                let dataObj = data[index];
                let temDataObj = {
                    "name": dataObj.name ? dataObj.name : "",
                    "costPerDay": (dataObj.costPerDay || dataObj.costPerDay === 0) ? dataObj.costPerDay : "",
                    "currencyId": dataObj.currencyId ? dataObj.currencyId : defaultCurrencyId,
                    "invalidFlag": false
                };
                dataArr.push(temDataObj);
            }
        } else {
            let temDataObj = {
                "name": "",
                "costPerDay": "",
                "currencyId": defaultCurrencyId,
                "invalidFlag": false
            };
            dataArr.push(temDataObj);
        }
        return dataArr;
    }
    static setDataWithoutDays(data) {
        let dataArr = [];
        for (let index = 0; index < data.length; index++) {
            let dataObj = data[index];
            if (dataObj.name && (dataObj.costPerDay || dataObj.costPerDay === 0) && dataObj.currencyId) {
                let temDataObj = {
                    "name": dataObj.name ? dataObj.name : "",
                    "costPerDay": (dataObj.costPerDay || dataObj.costPerDay === 0) ? dataObj.costPerDay : "",
                    "currencyId": dataObj.currencyId ? dataObj.currencyId : ""
                };
                dataArr.push(temDataObj);
            }
        }
        return dataArr;
    }
    static getDataWithoutName(data, defaultCurrencyId) {
        let dataArr = [];
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                let dataObj = data[index];
                let temDataObj = {
                    "costPerDay": (dataObj.costPerDay || dataObj.costPerDay === 0) ? dataObj.costPerDay : "",
                    "currencyId": dataObj.currencyId ? dataObj.currencyId : defaultCurrencyId
                };
                dataArr.push(temDataObj);
            }
        } else {
            let temDataObj = {
                "costPerDay": "",
                "currencyId": defaultCurrencyId
            };
            dataArr.push(temDataObj);
        }
        return dataArr;
    }
    static getWebServiceDetails(productionParametersDetails: any) {
        let productionParametersData;
        if (productionParametersDetails) {
            let generalObj = productionParametersDetails.general ? productionParametersDetails.general : {};
            let locationsObj = productionParametersDetails.locations ? productionParametersDetails.locations : {};
            let wardrobeObj = productionParametersDetails.wardrobe ? productionParametersDetails.wardrobe : {};
            let artDepartmentObj = productionParametersDetails.artDepartment ? productionParametersDetails.artDepartment : {};
            let equipmentObj = productionParametersDetails.equipment ? productionParametersDetails.equipment : {};
            if (productionParametersDetails) {
                productionParametersData = {
                    "locationShootDays": (generalObj.locationShootDays || generalObj.locationShootDays === 0) ? parseFloat(generalObj.locationShootDays) : '',
                    "stageShootDays": (generalObj.stageShootDays || generalObj.stageShootDays === 0) ? generalObj.stageShootDays : '',
                    "overtime": (generalObj.overtime || generalObj.overtime === 0) ? generalObj.overtime : '',
                    "locationPrepDays": (generalObj.locationPrepDays || generalObj.locationPrepDays === 0) ? generalObj.locationPrepDays : '',
                    "locationPreLight": (generalObj.locationPrelight || generalObj.locationPrelight === 0) ? generalObj.locationPrelight : '',
                    "stagePrepDays": (generalObj.stagePrepDays || generalObj.stagePrepDays === 0) ? generalObj.stagePrepDays : '',
                    "stagePreLight": (generalObj.stagePrelight || generalObj.stagePrelight === 0) ? generalObj.stagePrelight : '',
                    "scoutingDays": (generalObj.scoutingDays || generalObj.scoutingDays === 0) ? generalObj.scoutingDays : '',
                    "directorScoutDays": (generalObj.directorScoutDays || generalObj.directorScoutDays === 0) ? generalObj.directorScoutDays : '',
                    "technicalScoutDays": (generalObj.technicalScoutDays || generalObj.technicalScoutDays === 0) ? generalObj.technicalScoutDays : '',
                    "travelDays": (generalObj.travelDays || generalObj.travelDays === 0) ? generalObj.travelDays : '',
                    "foreignCrewMembers": (generalObj.foreignCrewMembers || generalObj.foreignCrewMembers === 0) ? generalObj.foreignCrewMembers : '',
                    "foreignAgencyMembers": (generalObj.foreignAgency || generalObj.foreignAgency === 0) ? generalObj.foreignAgency : '',
                    "foreignClientMembers": (generalObj.foreignClient || generalObj.foreignClient === 0) ? generalObj.foreignClient : '',
                    "mileage": {
                        "mileage": (generalObj.travelMileage || generalObj.travelMileage === 0) ? generalObj.travelMileage : '',
                        "metric": generalObj.travelMileageUnit ? generalObj.travelMileageUnit : ''
                    },
                    'locations': {
                        'interior': (locationsObj.interior && locationsObj.interior.length > 0) ? ManageProductionParametersData.setDataWithDays(locationsObj.interior) : [],
                        'exterior': (locationsObj.exterior && locationsObj.exterior.length > 0) ? ManageProductionParametersData.setDataWithDays(locationsObj.exterior) : [],
                        'special': (locationsObj.special && locationsObj.special.length > 0) ? ManageProductionParametersData.setDataWithDays(locationsObj.special) : [],
                        'cityPermits': (locationsObj.cityPermits && locationsObj.cityPermits.length > 0) ? ManageProductionParametersData.setCityPermitsData(locationsObj.cityPermits) : []
                    },
                    'wardrobe': {
                        'pcCurrencyId': wardrobeObj.pcCurrencyId ? wardrobeObj.pcCurrencyId : '',
                        'principalCost': (wardrobeObj.principalCost || wardrobeObj.principalCost === 0) ? wardrobeObj.principalCost : '',
                        'fecCurrencyId': wardrobeObj.fecCurrencyId ? wardrobeObj.fecCurrencyId : '',
                        'featuredExtraCost': (wardrobeObj.featuredExtraCost || wardrobeObj.featuredExtraCost === 0) ? wardrobeObj.featuredExtraCost : '',
                        'ecCurrencyId': wardrobeObj.ecCurrencyId ? wardrobeObj.ecCurrencyId : '',
                        'extrasCost': (wardrobeObj.extrasCost || wardrobeObj.extrasCost === 0) ? wardrobeObj.extrasCost : ''
                    },
                    'pictureVehicles': (productionParametersDetails.pictureVehicles && productionParametersDetails.pictureVehicles.length > 0) ? ManageProductionParametersData.setDataWithDays(productionParametersDetails.pictureVehicles) : [],
                    'carCareTransport': (productionParametersDetails.carCareAndTransport && productionParametersDetails.carCareAndTransport.length > 0) ? ManageProductionParametersData.setDataWithDays(productionParametersDetails.carCareAndTransport) : [],
                    'specialEffects': (productionParametersDetails.specialEffects && productionParametersDetails.specialEffects.length > 0) ? ManageProductionParametersData.setDataWithoutDays(productionParametersDetails.specialEffects) : [],
                    'animals': (productionParametersDetails.animals && productionParametersDetails.animals.length > 0) ? ManageProductionParametersData.setDataWithDays(productionParametersDetails.animals) : [],
                    'other1': (productionParametersDetails.other1 && productionParametersDetails.other1.length > 0) ? ManageProductionParametersData.setDataWithDays(productionParametersDetails.other1) : [],
                    'other2': (productionParametersDetails.other2 && productionParametersDetails.other2.length > 0) ? ManageProductionParametersData.setDataWithDays(productionParametersDetails.other2) : [],
                    'artDepartment': {
                        'setConstruction': (artDepartmentObj.setConstruction && artDepartmentObj.setConstruction.length > 0) ? ManageProductionParametersData.setDataWithoutDays(artDepartmentObj.setConstruction) : [],
                        // 'setDressing': (artDepartmentObj.setDressing && artDepartmentObj.setDressing.length > 0) ? ManageProductionParametersData.setDataWithoutDays(artDepartmentObj.setDressing) : [],
                        'setSigning': (artDepartmentObj.streetSingingOthers && artDepartmentObj.streetSingingOthers.length > 0) ? ManageProductionParametersData.getDataWithoutName(artDepartmentObj.streetSingingOthers, '') : [],
                        'greens': (artDepartmentObj.greens && artDepartmentObj.greens.length > 0) ? ManageProductionParametersData.getDataWithoutName(artDepartmentObj.greens, '') : [],
                        'specialManufacturers': (artDepartmentObj.specialManufactures && artDepartmentObj.specialManufactures.length > 0) ? ManageProductionParametersData.getDataWithoutName(artDepartmentObj.specialManufactures, '') : [],
                        'others': (artDepartmentObj.others && artDepartmentObj.others.length > 0) ? ManageProductionParametersData.setDataWithoutDays(artDepartmentObj.others) : []
                    },
                    'equipment': {
                        'camera': (equipmentObj.cameras || equipmentObj.cameras === 0) ? equipmentObj.cameras : '',
                        'lightningNightShootEquipment': (equipmentObj.lightiningNightShootEquipment || equipmentObj.lightiningNightShootEquipment === 0) ? equipmentObj.lightiningNightShootEquipment : '',
                        'cameraCar': (equipmentObj.cameraCar || equipmentObj.cameraCar === 0) ? equipmentObj.cameraCar : '',
                        'steadyCam': (equipmentObj.steadyCam || equipmentObj.steadyCam === 0) ? equipmentObj.steadyCam : '',
                        'crane': (equipmentObj.crane || equipmentObj.crane === 0) ? equipmentObj.crane : '',
                        'directSound': (equipmentObj.directSound || equipmentObj.directSound === 0) ? equipmentObj.directSound : ''
                    }
                };

            }
        }
        return productionParametersData;
    }
}
