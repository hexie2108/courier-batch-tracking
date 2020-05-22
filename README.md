# 快递运单号批量查询 

本应用是基于快递鸟免费api开发, 使用html+Jquery+bootstrap完成, 只要用游览器打开即可使用, 无需安装任何依赖和环境.
因为是使用了免费版api, 当前只支持3种快递的批量查询, 分别是 中通, 圆通 和 申通.

## 开发原因
受不了在快递官网查询快递 一次最多只能查询10条, 并且每次还要输入验证码, 太麻烦了.

## 如何使用
1. 前往快递鸟官网申请一个免费版key [https://www.kdniao.com/](https://www.kdniao.com/ "https://www.kdniao.com/").

2. 重命名 `js/key.exemple.js` 改成 `js/key.js`.

3. 使用快递鸟上获取到的 id 和 apikey 替换 `js/key.js` 里的数值.

```javascript
//快递鸟用户id
const EBusinessID = "替换成快递鸟用户ID";
//快递鸟apikey
const ApiKey = "替换成快递鸟密钥apikey";
```
4. 使用游览器打开 index.html 即可使用.


# Courier Batch Tracking

This application is based on the free api of kdniaocom. It is completed using html + Jquery + bootstrap. This app only needs a browser to use, without installing any dependencies and environments.
It uses the free version of the API, so currently only supports three couriers (ZTO, YTO and STO).

## Reason for development
You can only query up to 10 code at a time on the courier official website and every time you have to enter the verification code, it's too much trouble.

## how to use
1. Go to the official website of kdniao.com to get a free key [https://www.kdniao.com/](https://www.kdniao.com/ "https://www.kdniao.com/").

2. Rename `js/key.exemple.js`  to  `js/key.js`.

3. Replace the id value and key value in `js/key.js` 

```javascript
const EBusinessID = "XXX";
const ApiKey = "XXX";
```
4. use the browser to open `index.html` to start.