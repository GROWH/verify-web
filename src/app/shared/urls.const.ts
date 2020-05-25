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
   * 单位名下授权库房查看
   * @param uid
   */
  storehouseDownUnit: '/storehouse/queryAuditUnit',

  /**
   * GET
   * 单位名下可用温度计
   * @param uid
   */
  storehouseDownTher: '/storehouse/queryNotUsedTher',

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
  handRecordDownHouse: '/auditRecord/queryRecord',

  /**
   * GET
   * 库房点位温湿度记录查询
   * @param pid 点位ID
   * @param start_time 开始时间
   * @param end_time 结束时间
   */
  pointRecord: '/position/queryInTime',
  
  /**
   * POST
   * 保温箱温度上传接口
   */
  zeroDataUpload: '/thermometerManage/dataUpload',

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
  verifyBaseInfo: '/validation/',
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