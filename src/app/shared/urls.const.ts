import { Pagination } from '@/model/Types'
import { PaginationRes } from 'tongchang-lib'

export const Apis = {
  
  module:     '/module',
  moduleTree: '/module/tree',

  /**
   * GET
   * 根据code修改value
   */
  paramsUpdateByCode: '/params/updateByCode',
  /**
   * GET
   * 系统参数 Key 查询
   * @param code: string
   */
  paramsByKey: '/params/queryByCode',

  /**
   * POST
   * 角色新增
   * @param mids: number[]
   * 
   * PUT
   * 角色修改
   * @param mids: number[]
   * 
   * DELETE
   * 角色删除
   * 
   * GET
   * 查询
   */
  role: '/role',

  /**
   * POST
   * 库房新增
   * GET
   * 库房列表查询
   * PUT
   * 库房修改
   * DELETE
   * 库房删除
   */
  storehouse: '/storehouse',

  /**
   * POST
   * 库房告警设定
   */
  storehouseWarn: '/storehouse/alarmSetting',

  /**
   * POST
   * 库房告警设定
   */
  storehousePoint: '/storehouse/positionSet',

  /**
   * PUT
   * 库房查看授权
   * @param sid
   * @param uids
   */
  storehouseAuth: '/storehouse/queryAudit',

  /**
   * GET
   * 通过审核单位模糊查询
   * @param page
   * @param size
   * @param value
   */
  unitSearch: '/unit/queryApprovedUnit',

  /**
   * POST
   * 库房新增
   * GET
   * 库房列表查询
   * PUT
   * 库房修改
   * DELETE
   * 库房删除
   */
  handRecord: '/auditRecord/',

  /**
   * GET
   * 库房下人工记录查询
   * @param sid
   */
  handRecordDownHouse: '/auditRecord/queryRecord'
}

export function ResTrans<T>(res: Pagination<T>) {
  const newRes = new PaginationRes
  newRes.content       = res.list
  newRes.first         = res.firstPage
  newRes.last          = res.lastPage
  newRes.size          = res.pageSize
  newRes.totalPages    = res.totalPage
  newRes.totalElements = res.totalRow
  return newRes
}

export function Precent(float: number, precis: number = 2) {
  const ratio = 10 ** precis
  return Math.round(float * ratio) / ratio
}