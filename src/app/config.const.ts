export const PLATFORM_RIGHTS_KEY    = 'PLATFORM_RIGHTS_KEY'
export const VERIFY_COMP_RIGHTS_KEY = 'VERIFY_COMP_RIGHTS_KEY'
export const VERIFY_CUSM_RIGHTS_KEY = 'VERIFY_CUSM_RIGHTS_KEY'

export const WARN_TYPES = [
  { label: '温度', value: 'temp' },
  { label: '湿度', value: 'humi' },
  { label: '断电', value: 'power' },
  { label: '断网', value: 'network' },
]

export const WARN_CODE_MAP = WARN_TYPES.reduce((acc, it) => {
  acc[it.value] = it.label
  return acc
}, {})

export const LOGINED_USER_UNIT_KEY = 'LOGINED_USER_UNIT_KEY'