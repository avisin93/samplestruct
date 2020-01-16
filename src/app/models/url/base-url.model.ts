export class BaseUrl {
  static CM_CORE = 'http://localhost:3129/';
  static LISTEN = 'https://boxoffice-listen-qa.exela.global/'; // 'http://localhost:3114/'
  static EXELA_AUTH = 'https://exela-auth-qa.exela.global/';
  static CM_SCHEDULER = 'http://localhost:3130/';
  static ENV_PRODUCT_CODE = 'contractmanagement';
  static EXELA_PRODUCTS = {
    'boxoffice': 'http://localhost:3120',
    'dmr': 'http://localhost:3121',
    'dataroom': 'http://localhost:3122',
    'exelaces': 'http://localhost:3123',
    'contractmanagement': 'http://localhost:3129'
  };
  static NQUBE = 'https://boxoffice-nqube-qa.exela.global/'; // 'http://localhost:3116/'
  static BOXOFFICE_CORE = 'https://boxoffice-core-qa.exela.global/'; // 'http://localhost:3112/'

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
