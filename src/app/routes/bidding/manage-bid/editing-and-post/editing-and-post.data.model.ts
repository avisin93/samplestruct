export class EditingAndPostDataModel {
  /**
  ** method to get editingAndPostDetails object as per form structure
  return editingAndPostDetails as object as per form structure
  @param editingAndPostDetails as Object
  @param defaultCurrencyId as string
  */
  static getFormDetails(editingAndPostDetails: any, defaultCurrencyId: string) {
    let editingAndPostDataObj;
    if (editingAndPostDetails) {
      let soundObj = editingAndPostDetails.sound ? editingAndPostDetails.sound : {};
      let soundEditingObj = soundObj.soundEditing ? soundObj.soundEditing : {};
      let soundPostObj = soundObj.soundEditing ? soundObj.soundEditing : {};
      let imageObj = editingAndPostDetails.image ? editingAndPostDetails.image : {};
      let vfxObj = imageObj.vfx ? imageObj.vfx : {};
      editingAndPostDataObj = {
        editorAndPost: editingAndPostDetails.editorAndPostCoordinator ? EditingAndPostDataModel.getEditingAndPostData(editingAndPostDetails.editorAndPostCoordinator) : [],
        sound: {
          editing: (soundEditingObj.amount || soundEditingObj.amount == 0) ? soundEditingObj.amount : '',
          editingCurrencyId: soundEditingObj.currencyId ? soundEditingObj.currencyId : '',
          post: (soundPostObj.amount || soundPostObj.amount == 0) ? soundPostObj.amount : '',
          postCurrencyId: soundPostObj.currencyId ? soundPostObj.currencyId : '',
        },
        music: editingAndPostDetails.music ? EditingAndPostDataModel.getMusicData(editingAndPostDetails.music, defaultCurrencyId) : [],
        image: {
          vfx: (vfxObj.amount || vfxObj.amount == 0) ? vfxObj.amount : '',
          vfxCurrencyId: vfxObj.currencyId ? vfxObj.currencyId : '',
          animation: imageObj.animations ? EditingAndPostDataModel.getAnimationData(imageObj.animations, defaultCurrencyId) : [],
          versions: imageObj.imageMetaData ? EditingAndPostDataModel.getImageVersionData(imageObj.imageMetaData) : [],

        }
      }
      return editingAndPostDataObj;
    }
  }

  /**
  ** method to get editingAndPost data array as per form structure
  return editingAndPostArr as array of objects
  @param data as array of objects
  */
  static getEditingAndPostData(data: any) {
    let editingAndPostArr = [];
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        let dataObj = data[index];
        let temDataObj = {
          'title': dataObj.commercialTitle ? dataObj.commercialTitle : '',
          'version': dataObj.version ? dataObj.version : '',
          'editorCutdowns': dataObj.editorCutdown ? dataObj.editorCutdown : '',
          'pcCutdowns': dataObj.postCoordinatorCutdown ? dataObj.postCoordinatorCutdown : '',
          'invalidFlag': false
        };
        editingAndPostArr.push(temDataObj);
      }
    } else {
      let temDataObj = {
        'title': ' ',
        'version': '',
        'editorCutdowns': '',
        'pcCutdowns': '',
        'invalidFlag': false
      };
      editingAndPostArr.push(temDataObj);
    }
    return editingAndPostArr;
  }
  /**
  ** method to get music data array as per form structure
  return musicArr as array of objects
  @param data as array of objects
  */
  static getMusicData(data: any, defaultCurrencyId: string) {
    let musicArr = [];
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        let dataObj = data[index];
        let originalObj = dataObj.originalProduction ? dataObj.originalProduction : {};
        let rightsObj = dataObj.rights ? dataObj.rights : {};
        let buyoutObj = dataObj.buyOut ? dataObj.buyOut : {};
        let temDataObj = {
          'original': (originalObj.amount || originalObj.amount == 0) ? originalObj.amount : '',
          'originalCurrencyId': originalObj.currencyId ? originalObj.currencyId : defaultCurrencyId,
          'rights': (rightsObj.amount || rightsObj.amount == 0) ? rightsObj.amount : '',
          'rightsCurrencyId': rightsObj.currencyId ? rightsObj.currencyId : defaultCurrencyId,
          'buyOut': (buyoutObj.amount || buyoutObj.amount == 0) ? buyoutObj.amount : '',
          'buyOutCurrencyId': buyoutObj.currencyId ? buyoutObj.currencyId : defaultCurrencyId,
          'invalidFlag': false
        };
        musicArr.push(temDataObj);
      }
    } else {
      let temDataObj = {
        'original': '',
        'originalCurrencyId': defaultCurrencyId,
        'rights': '',
        'rightsCurrencyId': defaultCurrencyId,
        'buyOut': '',
        'buyOutCurrencyId': defaultCurrencyId,
        'invalidFlag': false
      };
      musicArr.push(temDataObj);
    }
    return musicArr;
  }
  /**
  ** method to get image version data array as per form structure
  return iamgeVersionArr as array of objects
  @param data as array of objects
  */
  static getImageVersionData(data: any) {
    let iamgeVersionArr = [];
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        let dataObj = data[index];
        let temDataObj = {
          'title': dataObj.commercialTital ? dataObj.commercialTital : '',
          'version': dataObj.version ? dataObj.version : '',
          'colorTiming': (dataObj.colorTiming || dataObj.colorTiming == 0) ? dataObj.colorTiming : '',
          'online': (dataObj.online || dataObj.online == 0) ? dataObj.online : '',
        };
        iamgeVersionArr.push(temDataObj);
      }
    } else {
      let temDataObj = {
        'title': '-',
        'version': '-',
        'colorTiming': '',
        'online': ''
      };
      iamgeVersionArr.push(temDataObj);
    }
    return iamgeVersionArr;
  }
  /**
  ** method to get animation data array as per form structure
  return animationArr as array of objects
  @param data as array of objects
  */
  static getAnimationData(data: any, defaultCurrencyId: string) {
    let editingAndPostArr = [];
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        let dataObj = data[index];
        let temDataObj = {
          'amount': (dataObj.amount || dataObj.amount == 0) ? dataObj.amount : '',
          'currencyId': dataObj.currencyId ? dataObj.currencyId : defaultCurrencyId,
        };
        editingAndPostArr.push(temDataObj);
      }
    } else {
      let temDataObj = {
        'amount': '',
        'currencyId': defaultCurrencyId
      };
      editingAndPostArr.push(temDataObj);
    }
    return editingAndPostArr;
  }
  /**
  ** method to set editingAndPostDetails object as per api structure
  return editingAndPostDetails as object as per api structure
  @param editingAndPostDetails as Object
  */
  static getWebserviceDetails(editingAndPostDetails: any) {

    let editingAndPostDataObj;
    if (editingAndPostDetails) {
      let soundObj = editingAndPostDetails.sound ? editingAndPostDetails.sound : {};
      let imageObj = editingAndPostDetails.image ? editingAndPostDetails.image : {};
      editingAndPostDataObj = {
        'editorAndPostCoordinator': editingAndPostDetails.editorAndPost ? EditingAndPostDataModel.setEditingAndPostData(editingAndPostDetails.editorAndPost) : [],
        'music': editingAndPostDetails.music ? EditingAndPostDataModel.setMusicData(editingAndPostDetails.music) : [],
        'sound': {
          'soundEditing': {
            'amount': (soundObj.editing || soundObj.editing == 0) ? soundObj.editing : '',
            'currencyId': soundObj.editingCurrencyId ? soundObj.editingCurrencyId : '',
          },
          'soundPost': {
            'amount': (soundObj.post || soundObj.post == 0) ? soundObj.post : '',
            'currencyId': soundObj.postCurrencyId ? soundObj.postCurrencyId : '',
          }
        },
        'image': {
          'vfx': {
            'amount': (imageObj.vfx || imageObj.vfx == 0) ? imageObj.vfx : '',
            'currencyId': imageObj.vfxCurrencyId ? imageObj.vfxCurrencyId : '',
          },
          'animations': (imageObj.animation && imageObj.animation.length > 0) ? EditingAndPostDataModel.setAnimationData(imageObj.animation) : [],
          'imageMetaData': (imageObj.versions && imageObj.versions.length > 0) ? EditingAndPostDataModel.setImageVersionData(imageObj.versions) : [],
        }

      }
    }
    return editingAndPostDataObj;
  }
  /**
  ** method to set editingAndPost data array as per api structure
  return editingAndPostArr as array of objects
  @param data as array of objects
  */
  static setEditingAndPostData(data: any) {
    let dataArr = [];
    for (let index = 0; index < data.length; index++) {
      let dataObj = data[index];
      if (dataObj.title && dataObj.version && ((dataObj.editorCutdowns || dataObj.editorCutdowns === 0) || (dataObj.pcCutdowns || dataObj.pcCutdowns === 0))) {
        let temDataObj = {
          'commercialTitle': dataObj.title ? dataObj.title : '',
          'version': dataObj.version ? dataObj.version : '',
          'editorCutdown': dataObj.editorCutdowns ? dataObj.editorCutdowns : '',
          'postCoordinatorCutdown': dataObj.pcCutdowns ? dataObj.pcCutdowns : '',
        };
        dataArr.push(temDataObj);
      }
    }
    return dataArr;
  }
  /**
 ** method to set music data array as per spi structure
 return musicArr as array of objects
 @param data as array of objects
 */
  static setMusicData(data: any) {
    let dataArr = [];
    for (let index = 0; index < data.length; index++) {
      let dataObj = data[index];
      if ((dataObj.original || dataObj.original == 0) || (dataObj.rights || dataObj.rights == 0) || (dataObj.buyOut || dataObj.buyOut == 0)) {
        let temDataObj = {
          'originalProduction': {
            'amount': (dataObj.original || dataObj.original == 0) ? dataObj.original : '',
            'currencyId': dataObj.originalCurrencyId ? dataObj.originalCurrencyId : '',
          },
          'rights': {
            'amount': (dataObj.rights || dataObj.rights == 0) ? dataObj.rights : '',
            'currencyId': dataObj.rightsCurrencyId ? dataObj.rightsCurrencyId : '',
          },
          'buyOut': {
            'amount': (dataObj.buyOut || dataObj.buyOut == 0) ? dataObj.buyOut : '',
            'currencyId': dataObj.buyOutCurrencyId ? dataObj.buyOutCurrencyId : '',
          }
        }
        dataArr.push(temDataObj);
      }
    }
    return dataArr;
  }
  /**
  ** method to set image version data array as per api structure
  return iamgeVersionArr as array of objects
  @param data as array of objects
  */
  static setImageVersionData(data: any) {
    let dataArr = [];
    for (let index = 0; index < data.length; index++) {
      let dataObj = data[index];
      let temDataObj = {
        'commercialTital': dataObj.title ? dataObj.title : '',
        'version': dataObj.version ? dataObj.version : '',
        'colorTiming': (dataObj.colorTiming || dataObj.colorTiming == 0) ? dataObj.colorTiming : '',
        'online': (dataObj.online || dataObj.online == 0) ? dataObj.online : '',
      };
      dataArr.push(temDataObj);
    }
    return dataArr;
  }
   /**
  ** method to set animation data array as per api structure
  return animationArr as array of objects
  @param data as array of objects
  */
  static setAnimationData(data: any) {
    let dataArr = [];
    for (let index = 0; index < data.length; index++) {
      let dataObj = data[index];
      if ((dataObj.amount || dataObj.amount === 0) && dataObj.currencyId) {
        dataArr.push(dataObj);
      }
    }
    return dataArr;
  }

}
