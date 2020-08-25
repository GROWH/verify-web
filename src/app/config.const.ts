export const PLATFORM_RIGHTS_KEY = 'PLATFORM_RIGHTS_KEY'
export const VERIFY_COMP_RIGHTS_KEY = 'VERIFY_COMP_RIGHTS_KEY'
export const VERIFY_CUSM_RIGHTS_KEY = 'VERIFY_CUSM_RIGHTS_KEY'

export const WARN_TYPES = [
  {label: '温度', value: 'temp'},
  {label: '湿度', value: 'humi'},
  {label: '断电', value: 'power'},
  {label: '断网', value: 'network'},
]

export const WARN_CODE_MAP = WARN_TYPES.reduce((acc, it) => {
  acc[it.value] = it.label
  return acc
}, {})

export const LOGINED_USER_UNIT_KEY = 'LOGINED_USER_UNIT_KEY'


//按钮权限控制
export function buttonAccess(value: string) {
  let isExist = false;
  const buttonpermsStr = localStorage.getItem('btnAuth');
  if (buttonpermsStr == undefined || buttonpermsStr == null) {
    return false;
  }
  if(JSON.parse(buttonpermsStr).length === 0){
    return true;
  }
  let buttonperms = JSON.parse(buttonpermsStr);
  for (let i = 0; i < buttonperms.length; i++) {
    if (buttonperms[i].indexOf(value) > -1) {
      isExist = true;
      break;
    }
  }
  return isExist;
}
