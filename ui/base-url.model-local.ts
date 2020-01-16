export class BaseUrl {
  static CM_CORE = "http://localhost:3129/";
  static EXELA_AUTH = "http://localhost:3110/";
  static CM_SCHEDULER = "http://localhost:3130/";

  public static get $cmCoreUrl (): string {
    return this.CM_CORE;
  }

  public static get $exelaAuthUrl (): string {
    return this.EXELA_AUTH;
  }

  public static get $cmSchedulerUrl (): string {
    return this.CM_SCHEDULER;
  }
}
