import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ContractService } from './contracts.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ContractResolve implements Resolve<Object> {

  constructor (private contractsService: ContractService) {}

  resolve (route: ActivatedRouteSnapshot) {
    let urlParams = {
      contractId: `${route.paramMap.get('id')}`
    };

    if (typeof urlParams.contractId !== 'undefined'
            && urlParams.contractId !== null
            && urlParams.contractId !== '0') {
      return this.contractsService.getContract(urlParams).pipe(
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
