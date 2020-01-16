export class BaseUrl {
  static CM_CORE = 'https://cm-core-qa.exela.global/';
  static LISTEN = 'https://boxoffice-listen-qa.exela.global/';
  static EXELA_AUTH = 'https://exela-auth-qa.exela.global/';
  static CM_SCHEDULER = 'https://cm-scheduler-qa.exela.global/';
  static ENV_PRODUCT_CODE = 'contractmanagement';
  static EXELA_PRODUCTS = {
    'boxoffice': 'https://boxoffice-qa.exela.global',
    'dmr': 'https://dmr-qa.exela.global',
    'dataroom': 'https://dataroom-qa.exela.global',
    'exelaces': 'https://exelaces-qa.exela.global',
    'contractmanagement': 'https://cm-qa.exela.global'
  };
  static NQUBE = 'https://boxoffice-nqube-qa.exela.global/';
  static BOXOFFICE_CORE = 'https://boxoffice-core-qa.exela.global/';

  public static get $cmCoreUrl (): string {
    return this.CM_CORE;
  }

  public static get $exelaAuthUrl (): string {
    return this.EXELA_AUTH;
  }

  public static get $cmSchedulerUrl (): string {
    return this.CM_SCHEDULER;
  }

  public static get $getEnvProductCode (): string {
    return this.ENV_PRODUCT_CODE;
  }

  public static get $getExelaProducts (): object {
    return this.EXELA_PRODUCTS;
  }

  public static get $listenUrl (): string {
    return this.LISTEN;
  }

  public static get $nQubeUrl (): string {
    return this.NQUBE;
  }

  public static get $boxofficeCoreUrl (): string {
    return this.BOXOFFICE_CORE;
  }
}
