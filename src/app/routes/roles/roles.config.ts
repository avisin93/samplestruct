import { ROUTER_LINKS_FULL_PATH } from '@app/config/routing.config';

export const ROUTER_LINKS_ROLES_FULL_PATH: any = {};
ROUTER_LINKS_ROLES_FULL_PATH['roles'] = ROUTER_LINKS_FULL_PATH['roles'];
ROUTER_LINKS_ROLES_FULL_PATH['manageRoles'] = ROUTER_LINKS_ROLES_FULL_PATH['roles'] + '/manage';