export class GridAction {
  code:          string;          // 按钮权限
  name:          string;          // 按钮名称
  type?:         string;          // 按钮类型 ng-zorro 按钮类型
  icon?:         string;          // 按钮图标 ng-zorro 图标类型
  click?:        () => any;       // 点击按钮时执行的函数
  multi?:        boolean = false; // 多个按钮合并做下拉
  multiActions?: GridAction[];    // 多个按钮对应的
  isExist?:      boolean;         //按钮权限
}

export const NO_FILTER = "NO_FILTER"
