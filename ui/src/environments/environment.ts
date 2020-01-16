// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // cmCore: 'http://localhost:3129',
  cmCore: 'https://cm-core-qa.exela.global',
  cmCorePort: '3129',
  cmScheduler: 'http://localhost:3130',
  cmSchedulerPort: '3130',
  cmFile: 'http://localhost:3131',
  cmFilePort: '3131',
  exelaAuth: 'https://exela-auth-qa.exela.global'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
