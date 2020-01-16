import { RuleCriteria } from './rule-criteria';

export class Rule {
  public id: any;
  public rule: String;
  public group: String;
  public reportOutputColumn: String;
  public dataSource: String;
  public weight: Number;
  public targetSource: String;
  public selected: Boolean;
  public active: Boolean;
  public isExcluded: Boolean;
  public ruleCriterias: RuleCriteria[] = new Array(0);
  public ruleQuery: any;
  public organizationid: String;
}
