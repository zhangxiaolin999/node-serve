// 随机数
export function randomNumber():Number {
  return Math.floor(Math.random()*1000)
}

// UUID随机数
export function randomUUid():String{
  var uuid = require('uuid')
  return uuid.v1()
}

// 带有 https的url
export function randomUrlHttps():String{
  const url = require('random-url');
  return url('https') 
}

// 带有 http的url
export function randomUrl():String{
  const url = require('random-url');
  return url()
}


/**
 * 随机返回名字
 * @export
 * @params surnames: { getOne: [Function] },
 * @params surnames:   names: {
                get1: [Function],
                get2: [Function],
                get3: [Function],
                get: [Function],
                dict: {
                '金': [Array],
                '木': [Array],
                '水': [Array],
                '火': [Array],
                '土': [Array]
                }
              },
 */
export function randomName():String{
  const name = require('chinese-random-name')
  return name.names.get()
}