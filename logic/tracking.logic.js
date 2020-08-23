//get environmental variables from env file
require('dotenv').config();

const http = require('./conn.util');
const crypto = require('crypto');
const md5 = require('md5');
const querystring = require('querystring');


const KUAI_DI_NIAO_URL = 'http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx';
const KUAI_DI_NIAO_USER_ID = process.env.KUAI_DI_NIAO_USER_ID;
const KUAI_DI_NIAO_USER_KEY = process.env.KUAI_DI_NIAO_USER_KEY;

const ZTO_URL = 'http://japi.zto.cn/traceInterfaceNewTraces';
const ZTO_USER_ID = process.env.ZTO_USER_ID;
const ZTO_USER_KEY = process.env.ZTO_USER_KEY;

const COURIER_CODES = {
    zto: 'zto',
    yto: 'yto',
    sto: 'sto',
};


/**
 * 查询快递信息
 * @param {int} trackingNumber
 * @param {string} courierCode
 * @return
 */
async function getTrackingInfo(trackingNumber, courierCode) {

    //如果配置文件错误
    if (!KUAI_DI_NIAO_USER_ID || !KUAI_DI_NIAO_USER_KEY || !ZTO_USER_ID || !ZTO_USER_KEY) {
        return createError("the backend is not configured correctly", 500);
    }

    //如果缺少运单号码
    if (!trackingNumber) {
        return createError("tracking number is empty", 400);
    }

    let response;

    switch (courierCode) {

        case COURIER_CODES.zto:
            response = await getZTOTracking(trackingNumber);
            break;
        case COURIER_CODES.yto:
            response = await getKUAIDINIAOTracking(trackingNumber, courierCode);
            break;
        case COURIER_CODES.sto:
            response = await getKUAIDINIAOTracking(trackingNumber, courierCode);
            break;
    }

    //如果快递编码错误
    if (!response) {
        return createError("courier code is error", 400);
    } else {
        response.trackingNumber = trackingNumber;
    }


    return {
        body: response,
        status: 200
    }

}

/**
 * 中通API查询
 * @param {int}trackingNumber
 * @return {Promise<{}>}
 */
async function getZTOTracking(trackingNumber) {

    let requestBody = {
        data: `['${trackingNumber}']`,
        company_id: ZTO_USER_ID,
        msg_type: "NEW_TRACES"
    }

    let queryString = [];
    for (let k in requestBody) {
        queryString.push(k + "=" + requestBody[k]);
    }
    let strToDigest = queryString.join("&") + ZTO_USER_KEY;

    let dataDigest = crypto.createHash('md5')
        .update(strToDigest)
        .digest('base64');

    let queryStringUrlencoded = querystring.stringify(requestBody);
    let header = {
        "x-companyid": ZTO_USER_ID,
        "x-datadigest": dataDigest,
    };

    let response = await http.postRawData(ZTO_URL, queryStringUrlencoded, header);
    return parseZTOResponse(response);

}


/**
 *通过快递鸟API查询
 * @param {int}trackingNumber
 * @param {string}courierCode
 * @return {{trace: {date: string, info: string}[]} || {error:Object}}
 */
async function getKUAIDINIAOTracking(trackingNumber, courierCode) {

    let requestDataString = JSON.stringify({
        ShipperCode: courierCode.toUpperCase(),
        LogisticCode: trackingNumber,
    });

    let requestData = md5(requestDataString + KUAI_DI_NIAO_USER_KEY);
    requestData = Buffer.from(requestData).toString('base64')

    //请求基本参数
    let requestBody = {
        EBusinessID: KUAI_DI_NIAO_USER_ID,
        RequestType: "1002",
        DataType: "2",
        DataSign: encodeURIComponent(requestData),
        RequestData: requestDataString,
    }

    let response = await http.post(KUAI_DI_NIAO_URL, requestBody, null);
    return parseKUAIDINIAOResponse(response);

}

/**
 * 解析中通API的回复
 * @param {{}}response
 * @return {{}}
 */
function parseZTOResponse(response) {

    let result = {};

    if (response.hasOwnProperty('data') && response.data.hasOwnProperty('data') && response.data.data.length > 0) {

        response = response.data.data[0];

        result.traces = [];
//如果有物流信息
        if (response.hasOwnProperty('traces') && response.traces.length > 1) {

            //逆转数组顺序
            response.traces = response.traces.reverse();

            response.traces.forEach((item) => {
                result.traces.push({
                    date: item.scanDate,
                    info: item.desc,
                });
            });


        }
    } else {
        result.error = response;
    }

    return result;

}


/**
 * 解析快递鸟API的回复
 * @param {{}}response
 * @return {{}}
 */
function parseKUAIDINIAOResponse(response) {

    let result = {};

    if (response.hasOwnProperty('data')) {

        response = JSON.parse(response.data);

        if (response.hasOwnProperty('Traces')) {

            result.traces = [];
            //如果有物流信息
            if (response.Traces.length > 1) {
                //逆转数组顺序
                response.Traces = response.Traces.reverse();

                response.Traces.forEach((item) => {
                    result.traces.push({
                        date: item.AcceptTime,
                        info: item.AcceptStation,
                    });
                });

            }

        } else {
            result.error = response;
        }
    } else {
        result.error = response;
    }

    return result;

}


/**
 *创建错误
 * @param {string}errorMessage
 * @param {int}errorCode
 * @return {{body: string, status: int}}
 */
function createError(errorMessage, errorCode) {
    return {
        body: {
            error: errorMessage
        },
        status: errorCode,
    }
}


module.exports.getTrackingInfo = getTrackingInfo;
