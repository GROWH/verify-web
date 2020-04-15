import { DataBase } from './Types';
import { SystemModule } from './SystemModule';

export class Role extends DataBase {

  constructor(mids: number[], type?: number) {
    super()
    this.resource = mids
    this.type = type
  }

  role_name: string;
  unit_id:   number;
  type: number;
  resource:  number[];
}

export class RoleWithMos extends DataBase {
  role_name: string;
  unit_id:   number;
  type: number;
  resource:  SystemModule[];
}