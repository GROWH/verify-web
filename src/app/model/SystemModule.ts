import { DataBase } from './Types';
import { NzTreeNodeOptions, NzTreeNode } from 'ng-zorro-antd';
import { DebugLog } from 'tongchang-lib';

export class SystemModule extends DataBase {
  constructor(type = 1, parent_id = 0, is_menu = true) {
    super()
    this.type = type
    this.is_menu = is_menu
    this.parent_id = parent_id
  }
  key_word:      string;     // 关键字
  module_code:   string;     //
  module_name:   string;     // 模块名称
  module_url:    string;     // 路由
  order_number:  number;     // 顺序号
  parent_id:     number;     // 父模块 ID
  type:          number;     // 类型
  is_menu:       boolean;    // 是否为系统菜单
  children:      SystemModule[];
}

/**
 *
 * @param modules      系统模块
 * @param checkedNodes 选中模块 ID
 */
export function convertNodes(
  modules: SystemModule[],
  checkedNodes: number[]
): NzTreeNodeOptions[] {
  return modules.map(item => {
    let children: NzTreeNodeOptions[] = []
    if (item.children && item.children.length > 0) {
      children = convertNodes(item.children, checkedNodes)
    }

    const isLeaf = children.length === 0

    return {
      title: item.module_name,
      key:   item.id + '',
      children,
      selectable: false,
      isLeaf: item.type === 3,
      checked: isLeaf && checkedNodes.includes(item.id)
      // module: item
    } as NzTreeNodeOptions
  })
}

/**
 * 获取 antd 树中所有key
 * @param nodes   antd 树
 * @param _result
 */
export function getTreeKeys(nodes: NzTreeNode[], _result = []): string[] {

  nodes.forEach(node => {
    _result.push(node.key)
    if (node.children && node.children.length > 0) {
      _result = [ ..._result, ...getTreeKeys(node.children)]
    }
  })

  return _result
}

