import { DataBase } from './Types';

export class Unit extends DataBase {
  unit_name:     string;    //单位名称
  social_code:   string;    //统一社会信用代码
  parent_id:     string;    //上级单位
  unit_type:     number;    //单位类型
  state:         string;    //状态
  fixed_phone:   string;    //单位固话
  linkman:       boolean;   //联系人
  cell_phone:    boolean;   //联系人手机
  unit_address:  string;    //单位地址
  unit_email:    string;    //邮箱
  fax:           boolean;   //传真
  bank:          string;    //开户银行
  bank_account:  string;    //银行账号
  auditor:       string;    //审核人
  audit_mark:    string;    //审核备注
  audit_time:    string;    //审核时间
  mark:          string;    //备注
}