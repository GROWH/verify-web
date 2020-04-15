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