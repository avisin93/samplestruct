/**
* Component     : Configuration
 
* Creation Date : 3rd Jan 2020
*/

import { environment as env } from '../../environments/environment';
import { environment as envDev } from '../../environments/environment.dev';
import { environment as envStage } from '../../environments/environment.stage';
import { environment as envUat } from '../../environments/environment.uat';
import { environment as envProd} from '../../environments/environment.prod';

class Environment {
  public environment: any = {};
  constructor( private window: Window ) {
    const hostname = this.window.location.hostname;
    const devAdmin = hostname.match(/^devportal\.thelift\.mx:8443/);
    const stageAdmin = hostname.match(/^stageportal\.thelift\.mx/);
    const uatAdmin = hostname.match(/^uatportal\.thelift\.mx/);
    const prodAdmin = hostname.match(/^portal\.thelift\.mx/);
    const localAdmin = hostname.match(/^localhost\:[0-9]+/);
    this.environment = envDev;
    if (devAdmin !== undefined && devAdmin != null && devAdmin.length > 0) {
      this.environment = envDev;
    } else if (stageAdmin !== undefined && stageAdmin != null && stageAdmin.length > 0) {
      this.environment = envStage;
    } else if (uatAdmin !== undefined && uatAdmin != null && uatAdmin.length > 0) {
      this.environment = envUat;
    } else if (prodAdmin !== undefined && prodAdmin != null && prodAdmin.length > 0) {
      this.environment = envProd;
    } else if (localAdmin != null && localAdmin.length > 0 || hostname === 'localhost' || hostname === '192.168.15.102') {
      this.environment = env;
    }
  }
}
export class Configuration {
  public static ENV = new Environment(window).environment;
  public static MEDIA_ROOT = ['assets/'];
  public static VIDEO_URL = Configuration.MEDIA_ROOT + 'videos/';
  public static IMAGES_URL = Configuration.MEDIA_ROOT + 'images/';
  public static API_ENDPOINT = Configuration.ENV.apiUrl;
  public static FRONTEND_URL = Configuration.ENV.frontendUrl;
  public static S3_BUCKET_URL = Configuration.ENV.s3BucketUrl;
  public static PREBID_ENDPOINT = Configuration.ENV.preBidUrl;
}
