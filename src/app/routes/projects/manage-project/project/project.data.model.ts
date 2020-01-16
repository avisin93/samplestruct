import {  PROJECT_TYPES } from '../../../../config';
export class ManageProjectData {
  /**
  return Role details data as per formcontrol
  @param projectDetails as Object
  **/
  static getProjectFormDetails(projectDetails: any) {
    var projectFormData;
    let budgetSheetData = projectDetails.budgetSheetFile;
    if (projectDetails) {
      projectFormData = {
        'jobNo': projectDetails.jobNumber ? projectDetails.jobNumber : '',
        'director': projectDetails.director ? projectDetails.director : '',
        'division': projectDetails.division ? projectDetails.division : '',
        'section': (projectDetails.projectType && projectDetails.projectType.name) ? projectDetails.projectType.name : '',
        'projectType': (projectDetails.projectType && projectDetails.projectType.id) ? projectDetails.projectType.id : '',
        'foreignProducer': projectDetails.foreignProducerName ? projectDetails.foreignProducerName : '',
        'budgetSheetUrl': (budgetSheetData && budgetSheetData.url) ? budgetSheetData.url : '',
        'budgetSheetId': (budgetSheetData && budgetSheetData.id) ? budgetSheetData.id : '',
        'projectDocuments': projectDetails.projectDocuments ? ManageProjectData.getProjectDocuments(projectDetails.projectDocuments) : []
      }
      if ((projectFormData.projectType == PROJECT_TYPES.entertainment) && projectDetails.entertainment) {
        if (projectDetails.entertainment.studio) {
          let studioData = projectDetails.entertainment.studio;
          projectFormData['logo1Url'] = studioData.fileUrl ? studioData.fileUrl : '';
          projectFormData['logo1Name'] = studioData.name ? studioData.name : '';
          projectFormData['logo1Id'] = studioData.iconFileId ? studioData.iconFileId : '';
        }
        if (projectDetails.entertainment.productionCompany) {
          let productionCompanyData = projectDetails.entertainment.productionCompany;
          projectFormData['logo2Url'] = productionCompanyData.fileUrl ? productionCompanyData.fileUrl : '';
          projectFormData['logo2Name'] = productionCompanyData.name ? productionCompanyData.name : '';
          projectFormData['logo2Id'] = productionCompanyData.iconFileId ? productionCompanyData.iconFileId : '';
        }
        if (projectDetails.entertainment.intlProductionCompany) {
          let intlProductionCompanyData = projectDetails.entertainment.intlProductionCompany;
          projectFormData['logo3Url'] = intlProductionCompanyData.fileUrl ? intlProductionCompanyData.fileUrl : '';
          projectFormData['logo3Name'] = intlProductionCompanyData.name ? intlProductionCompanyData.name : '';
          projectFormData['logo3Id'] = intlProductionCompanyData.iconFileId ? intlProductionCompanyData.iconFileId : '';
        }
      }
      if ((projectFormData.projectType == PROJECT_TYPES.commercial) && projectDetails.commercial) {
        if (projectDetails.commercial.brand) {
          let brandData = projectDetails.commercial.brand
          projectFormData['logo1Url'] = brandData.fileUrl ? brandData.fileUrl : '';
          projectFormData['logo1Name'] = brandData.name ? brandData.name : '';
          projectFormData['logo1Id'] = brandData.iconFileId ? brandData.iconFileId : '';
        }
        if (projectDetails.commercial.agency) {
          let agencyData = projectDetails.commercial.agency;
          projectFormData['logo2Url'] = agencyData.fileUrl ? agencyData.fileUrl : '';
          projectFormData['logo2Name'] = agencyData.name ? agencyData.name : '';
          projectFormData['logo2Id'] = agencyData.iconFileId ? agencyData.iconFileId : '';
        }
        if (projectDetails.commercial.intlProductionCompany) {
          let intlProductionCompanyData = projectDetails.commercial.intlProductionCompany;
          projectFormData['logo3Url'] = intlProductionCompanyData.fileUrl ? intlProductionCompanyData.fileUrl : '';
          projectFormData['logo3Name'] = intlProductionCompanyData.name ? intlProductionCompanyData.name : '';
          projectFormData['logo3Id'] = intlProductionCompanyData.iconFileId ? intlProductionCompanyData.iconFileId : '';
        }
      }
    }
    return projectFormData;
  }
  // getProjectDocuments()
  // {
  //
  // }
  static getProjectDocuments(projectDocumentsData) {
    var projectDocumentsDataArr = [];

    for (var i = 0; i < projectDocumentsData.length; i++) {
      projectDocumentsDataArr.push({
        'name': projectDocumentsData[i].name ? projectDocumentsData[i].name : '',
        'fileName': (projectDocumentsData[i].file && projectDocumentsData[i].file.name) ? projectDocumentsData[i].file.name : '',
        'url': (projectDocumentsData[i].file && projectDocumentsData[i].file.url) ? projectDocumentsData[i].file.url : '',
        'fileId': (projectDocumentsData[i].file && projectDocumentsData[i].file.id) ? projectDocumentsData[i].file.id : '',
      });
    }
    return projectDocumentsDataArr;
  }
  static setProjectDocuments(projectDocumentsData) {
    var projectDocumentsDataArr = [];

    for (var i = 0; i < projectDocumentsData.length; i++) {
      if (projectDocumentsData[i].fileId) {
        projectDocumentsDataArr.push({
          'name': projectDocumentsData[i].name ? projectDocumentsData[i].name : '',
          'fileId': projectDocumentsData[i].fileId ? projectDocumentsData[i].fileId : '',
        });
      }
    }
    return projectDocumentsDataArr;
  }
  static getWebServiceDetails(projectDetails: any) {
    var projectFormData;
    if (projectDetails) {
      projectFormData = {
        'director': projectDetails.director ? projectDetails.director : '',
        'foreignProducerName': projectDetails.foreignProducer ? projectDetails.foreignProducer : '',
        'projectDocuments': projectDetails.projectDocuments ? ManageProjectData.setProjectDocuments(projectDetails.projectDocuments) : ''
      }
      if (projectDetails.projectType == PROJECT_TYPES.commercial) {
        let commerciaObj = {
          'brand': {
            'iconFileId': projectDetails.logo1Id ? projectDetails.logo1Id : '',
            'name': projectDetails.logo1Name ? projectDetails.logo1Name : ''
          },
          'agency': {
            'iconFileId': projectDetails.logo2Id ? projectDetails.logo2Id : '',
            'name': projectDetails.logo2Name ? projectDetails.logo2Name : '',
          },
          'intlProductionCompany': {
            'iconFileId': projectDetails.logo3Id ? projectDetails.logo3Id : '',
            'name': projectDetails.logo3Name ? projectDetails.logo3Name : '',
          }
        }
        // if (projectDetails.logo1Id)
        //   commerciaObj['brand']['iconFileId'] = projectDetails.logo1Id;
        // if (projectDetails.logo2Id)
        //   commerciaObj['agency']['iconFileId'] = projectDetails.logo2Id;
        // if (projectDetails.logo3Id)
        //   commerciaObj['intlProductionCompany']['iconFileId'] = projectDetails.logo3Id;
        projectFormData['commercial'] = commerciaObj;
      }
      else if (projectDetails.projectType == PROJECT_TYPES.entertainment) {
        let entertainmentObj = {
          'studio': {
            'iconFileId': projectDetails.logo1Id ? projectDetails.logo1Id : '',
            'name': projectDetails.logo1Name ? projectDetails.logo1Name : ''
          },
          'productionCompany': {
            'iconFileId': projectDetails.logo2Id ? projectDetails.logo2Id : '',
            'name': projectDetails.logo2Name ? projectDetails.logo2Name : '',
          },
          'intlProductionCompany': {
            'iconFileId': projectDetails.logo3Id ? projectDetails.logo3Id : '',
            'name': projectDetails.logo3Name ? projectDetails.logo3Name : '',
          },
        }
        // if (projectDetails.logo1Id)
        //   entertainmentObj['studio']['iconFileId'] = projectDetails.logo1Id;
        // if (projectDetails.logo2Id)
        //   entertainmentObj['productionCompany']['iconFileId'] = projectDetails.logo2Id;
        // if (projectDetails.logo3Id)
        //   entertainmentObj['intlProductionCompany']['iconFileId'] = projectDetails.logo3Id;
        projectFormData['entertainment'] = entertainmentObj;
      }
    }
    return projectFormData;
  }

}
