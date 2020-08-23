# 快递运单号批量查询 

本应用是基于快递鸟免费api开发, 使用html+Jquery+bootstrap完成, 只要用游览器打开即可使用, 无需安装任何依赖和环境.
因为是使用了免费版api, 当前只支持3种快递的批量查询, 分别是 中通, 圆通 和 申通.

## v2版本更新 2020/08/23
增加单独中通API的调用, 另外快递鸟的免费套餐已不支持中通, 需要另外申请中通的接口


## 开发原因
受不了在快递官网查询快递 一次最多只能查询10条, 并且每次还要输入验证码, 太麻烦了.

## 如何使用
1. 前往快递鸟官网申请一个免费版key [https://www.kdniao.com/](https://www.kdniao.com/ "https://www.kdniao.com/").

2. 前往中通开放平台官网申请一个key [https://zop.zto.com/index](https://zop.zto.com/index "https://zop.zto.com/index").

3. 重命名 `.env.sample` 改成 `.env` .

4. 使用快递鸟上和中通上获取到的 id 和 key 替换`.env` 里的数值.

```javascript
#自定义端口 默认为3000
PORT = 3000
#快递鸟用户ID
KUAI_DI_NIAO_USER_ID = XXXX
#快递鸟用户KEY
KUAI_DI_NIAO_USER_KEY = XXXX
#中通用户ID
ZTO_USER_ID = XXXX
#中通用户KEY
ZTO_USER_KEY = XXXX
```

5. 运行 `npm install` 安装依赖

6. 使用游览器打开 http://localhost:3000 即可使用.


# Courier Batch Tracking

This application is based on the free api of kdniaocom. It is completed using html + Jquery + bootstrap. This app only needs a browser to use, without installing any dependencies and environments.
It uses the free version of the API, so currently only supports three couriers (ZTO, YTO and STO).

## Reason for development
You can only query up to 10 code at a time on the courier official website and every time you have to enter the verification code, it's too much trouble.

## how to use
1. Go to the official website of kdniao.com to get a free key [https://www.kdniao.com/](https://www.kdniao.com/ "https://www.kdniao.com/").

2. Go to the official website of zto to get a key  [https://zop.zto.com/index](https://zop.zto.com/index "https://zop.zto.com/index").

2. Rename  `.env.sample`  to `.env` .

3. Replace the id value and key value in `.env`

```javascript
#自定义端口 默认为3000
PORT = 3000
#快递鸟用户ID
KUAI_DI_NIAO_USER_ID = XXXX
#快递鸟用户KEY
KUAI_DI_NIAO_USER_KEY = XXXX
#中通用户ID
ZTO_USER_ID = XXXX
#中通用户KEY
ZTO_USER_KEY = XXXX
```

5. execute `npm install`  to install dependencies

6. open http://localhost:3000 to use.
