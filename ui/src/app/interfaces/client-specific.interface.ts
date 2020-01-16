interface IClientData {
  _id: String;
  name: String;
  code: String;
  valid_from: Date;
  valid_to: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClientSpecific {
  business_partner: IClientData[];
  category: IClientData[];
  legal_entity: IClientData[];
  linked_opportunity: IClientData[];
  project: IClientData[];
  service: IClientData[];
  sub_service: IClientData[];
}
