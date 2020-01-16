export class ManageCurrenciesData {
    /**
    return Role details data as per formcontrol
    @param currencyConversionDetails as Object
    **/
    static getWebServiceDetails(currencyConversionDetails: any) {
      var currencyConversionData=[];
      if (currencyConversionDetails && currencyConversionDetails.length > 0) {
          for(let index=0;index<currencyConversionDetails.length;index++)
          {
           let obj = {
                "isEditable": currencyConversionDetails[index].isEditable ? currencyConversionDetails[index].isEditable : false,
                "sourceCurrencyId": currencyConversionDetails[index].sourceCurrencyId ? currencyConversionDetails[index].sourceCurrencyId : "",
                "sourceUnit": currencyConversionDetails[index].sourceUnit ? currencyConversionDetails[index].sourceUnit : 0,
                "targetCurrencyId": currencyConversionDetails[index].targetCurrencyId ? currencyConversionDetails[index].targetCurrencyId : "",
                "targetUnit": currencyConversionDetails[index].targetUnit ? currencyConversionDetails[index].targetUnit : 0,
              }
              currencyConversionData.push(obj);
          }
     
  
      }
      return currencyConversionData;
    }
  
  }
  