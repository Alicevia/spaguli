/*
包含n个日期时间处理的工具函数模块
*/

/*
  格式化日期
*/
export function formateDate(time) {
  let temp = '{0}年{1}月{2}日 {3}时{4}分{5}秒'
  let date 
  if (time) {
    date = new Date(time);
    date = date.toLocaleString('chinese', { hour12: false });
  }else {
    date = new Date();
    date = date.toLocaleString('chinese', { hour12: false });
  }

  let ary = date.match(/\d+/g)
  let res = temp.replace(/\{(\d)\}/g,(...arg)=>{
      return ary[arg[1]]
  })
  return res
}