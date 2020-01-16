import { ROUTER_LINKS_FULL_PATH } from '@app/config/routing.config';

export const ROUTER_LINKS_TALENT_FULL_PATH: any = {};
ROUTER_LINKS_TALENT_FULL_PATH['talent'] = ROUTER_LINKS_FULL_PATH['talent'];
ROUTER_LINKS_TALENT_FULL_PATH['agency'] = ROUTER_LINKS_FULL_PATH['agency'];
ROUTER_LINKS_TALENT_FULL_PATH['individual'] = ROUTER_LINKS_FULL_PATH['individual'];


ROUTER_LINKS_TALENT_FULL_PATH['manageAgency'] = ROUTER_LINKS_TALENT_FULL_PATH['agency'] + '/manage';
ROUTER_LINKS_TALENT_FULL_PATH['manageIndividual'] = ROUTER_LINKS_TALENT_FULL_PATH['individual'] + '/manage';
