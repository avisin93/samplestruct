export class ManageRolesDataModel {
  /**
  return Role details data as per formcontrol
  @param rolesDetails as Object
  **/
  static getFormDetails(rolesDetails: any) {
    let roleFormData = {};
    if (rolesDetails) {
      roleFormData = {
        'id': rolesDetails.id ? rolesDetails.id : '',
        'roleName': (rolesDetails.roleName) ? rolesDetails.roleName : '',
        'parentRole': (rolesDetails.parentId) ? rolesDetails.parentId : '',
        'landingModuleId': (rolesDetails.landingModuleId) ? parseInt(rolesDetails.landingModuleId) : '',
        'modules': (rolesDetails.modules && rolesDetails.modules.length > 0) ? ManageRolesDataModel.getModulesData(rolesDetails.modules) : []
      };
    }
    return roleFormData;
  }
  /**
   * getFinalRolesData get call on save role
   * @param  rolesDetails contains role details form information
   * @return          roleFormData as object
   */
  static getWebServiceDetails(rolesDetails: any) {

    let roleFormData;
    if (rolesDetails) {
      roleFormData = {
        'roleName': (rolesDetails.roleName) ? rolesDetails.roleName : '',
        'landingModuleId': (rolesDetails.landingModuleId) ? parseInt(rolesDetails.landingModuleId) : 0,
        'parentId': (rolesDetails.parentRole) ? rolesDetails.parentRole : '',
        'modules': (rolesDetails.modules.length > 0) ? ManageRolesDataModel.setModulesData(rolesDetails.modules, rolesDetails.landingModuleId) : []
      };
    }
    return roleFormData;
  }

  /**
   * getModulesData method is use to get information about module
   * @param  modulesData     as object contains the information about module
   * @param  landingModuleId indicates the landing module id
   * @param  roleId          indicates the role id
   * @return          modules       as object
   */
  static getModulesData(modulesData) {
    const modules = [];
    for (let i = 0; i < modulesData.length; i++) {
      modules.push({
        'moduleId': parseInt(modulesData[i].moduleId),
        'moduleName': modulesData[i].uiName ? modulesData[i].uiName : '',
        'id': modulesData[i].moduleAccessId ? modulesData[i].moduleAccessId : '',
        'view': (modulesData[i].view) ? modulesData[i].view : false,
        'create': (modulesData[i].create) ? modulesData[i].create : false,
        'edit': (modulesData[i].edit) ? modulesData[i].edit : false,
        'delete': (modulesData[i].delete) ? modulesData[i].delete : false,
        'landingPage': modulesData[i].landingPage ? modulesData[i].landingPage : ''
      });

      if (modulesData[i].moduleAccessId) {
        modules['moduleAccessId'] = modulesData[i].moduleAccessId ? modulesData[i].moduleAccessId : '';
      }
    }
    return modules;
  }
  /**
   * setModulesData method is use to set information about module
   * @param  modulesData     as object contains the information about module
   * @param  landingModuleId indicates the landing module id
   * @return          modules     which contains moduleObj as object
   * */
  static setModulesData(modulesData, landingModuleId) {
    const modules = [];
    for (let i = 0; i < modulesData.length; i++) {

      const moduleObj = {
        'moduleId': parseInt(modulesData[i].moduleId),
        'view': (modulesData[i].view) ? modulesData[i].view : false,
        'create': (modulesData[i].create) ? modulesData[i].create : false,
        'edit': (modulesData[i].edit) ? modulesData[i].edit : false,
        'delete': (modulesData[i].delete) ? modulesData[i].delete : false,
        'landingPage': (modulesData[i].moduleId === parseInt(landingModuleId)) ? true : false
      };
      if (modulesData[i].id) {
        moduleObj['moduleAccessId'] = modulesData[i].id ? modulesData[i].id : '';
      }

      // if (modulesData[i].id) {
      //   moduleObj['id'] = modulesData[i].id;
      // }
      modules.push(moduleObj);
    }
    return modules;
  }
}

