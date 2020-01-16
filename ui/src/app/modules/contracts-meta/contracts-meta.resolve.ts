import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ContractsMetaService } from './contracts-meta.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ContractMetaResolve implements Resolve<Object> {

  constructor (private contractsMetaService: ContractsMetaService) {}

  resolve (route: ActivatedRouteSnapshot) {
    const urlParams = {
      contractId: `${route.paramMap.get('id')}`
    };
    if (typeof urlParams.contractId !== 'undefined'
            && urlParams.contractId !== null
            && urlParams.contractId !== '0') {
      return this.contractsMetaService.getContractMeta(urlParams).pipe(
                catchError(error => {
                  const message = 'Retrieval error:' + error.message;
                  console.error(message);
                  console.log(error);
                  return of({ contract: null, error: message });
                })
              );
    } else {
      return;
    }
  }
}
