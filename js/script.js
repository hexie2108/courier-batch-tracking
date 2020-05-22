//实时物流查询api地址
const URL = "http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx";

const ID_PREFIX = "code-";

//页面切换动画时间 (毫秒)
const ANIMATION_SPEED = 500;

//请求基本参数
let requestBody = {
    EBusinessID: USER_ID,
    RequestType: 1002,
    DataType: 2,
}

$(function () {
    //点击查询按钮触发
    $("#submit").click(function () {

        reset();

        let $pendingTextArea = $("#pending-list");
        //根据换行符把文本转换成数组
        let shipperCodeList = $pendingTextArea.val().split("\n");

        shipperCodeList = formatValue(shipperCodeList);

        //把处理过的文本数组重新转换回字符串
        $pendingTextArea.val(shipperCodeList.join("\n"));

        //如果数组不是空的
        if (shipperCodeList.length > 0) {

            createElement(shipperCodeList);
            sendRequest(shipperCodeList, getSelectedCourierCode());
            initProgressBar(shipperCodeList);

        }

    });

})

/**
 * 格式化数组的元素, 去除字母和数字以外的字符 以及空元素
 * @param shipperCodeList {string[]}
 * @returns {string[]}
 */
function formatValue(shipperCodeList) {
    return shipperCodeList.map(element => {
        if (element) {
            return element.replace(/[^0-9A-z]/ig, "");
        }
    }).filter(element => {
        return element;
    });
}

/**
 * 批量发送post请求
 * @param codeList {string[]} 需要查询的物流单号数组
 * @param courierCode {string} 快递编号
 */
function sendRequest(codeList, courierCode) {

    for (let code of codeList) {

        let requestDataString = JSON.stringify({
            ShipperCode: courierCode,
            LogisticCode: code
        });

        requestBody.DataSign = encodeURIComponent(btoa(md5(requestDataString + API_KEY)));
        requestBody.RequestData = requestDataString;

        $.post(URL, requestBody, function (response) {

           let responseObject = JSON.parse(response);
            setElement(responseObject);
            modifyList(responseObject);
            setProgressBar();

        });
    }

}


/**
 * 根据物流单号的数量 在请求前先在物流列表中创建空元素
 * @param codeList {string[]}
 */
function createElement(codeList) {

    let $resultList = $("#result");

    for (let code of codeList) {

        let htmlElementContent =
            `<a class="btn btn-outline-info text-left w-100" data-toggle="collapse" href="#collapse-${code}" role="button">
                <span class="">
                    运单号: ${code}
                </span>
                <span class="last-info float-right text-left my-2 my-md-0">
                        
                </span>    
            </a>
            <div class="collapse" id="collapse-${code}">
                <div class="card card-body">
                </div>
            </div>`;

        let $htmlElement = $("<div></div>").attr('id', ID_PREFIX + code).addClass('my-2').css('display', 'none').html(htmlElementContent);

        $resultList.append($htmlElement);
    }

}

/**
 * 根据物流查询结果在有物流和无物流列表中更新对应运单号
 * @param response {object} 单个物流信息查询结果
 */
function modifyList(response) {

    if (response.LogisticCode) {

        let $listTextArea;
        //数组不是空 说明有物流信息
        if (response.Traces && response.Traces.length > 0) {
            $listTextArea = $("#found-list");
        } else {
            $listTextArea = $("#not-found-list");
        }

        let value = $listTextArea.val() + response.LogisticCode + "\n";
        $listTextArea.val(value);
    }
}

/**
 * 根据每个运单的查询结果 在物流列表中 显示对应信息
 * @param response {object} 单个物流信息查询结果
 */
function setElement(response) {


    let lastInfo = "无物流信息";
    let tracesInfo = "<ul class='list-group'>";
    if (response.Traces && response.Traces.length > 0) {
        lastInfo = `<b>${response.Traces[0].AcceptTime}</b> ${response.Traces[0].AcceptStation}`;
        for (let trace of response.Traces) {
            tracesInfo += `<li class="list-group-item"><b>${trace.AcceptTime}</b> ${trace.AcceptStation}</li>`
        }
    }
    tracesInfo += "</ul>";

    $element = $(`#${ID_PREFIX}${response.LogisticCode}`);
    $element.find("a span.last-info").html(lastInfo);
    $element.find("div.collapse div").append(tracesInfo);
    $element.show(ANIMATION_SPEED);

}

/**
 * 重置页面状态
 */
function reset() {
    $("#result").empty();
    $("#found-list").val("");
    $("#not-found-list").val("");
}

/**
 * 初始化加载进度条
 * @param shipperCodeList {string[]}
 */
function initProgressBar(shipperCodeList) {

    let $progressBar = $(".progress .progress-bar");

    $progressBar.attr("currentCount", 0);
    $progressBar.attr("totalCount", shipperCodeList.length);
    $progressBar.html(`0 / ${shipperCodeList.length}`);
    $progressBar.css("width", "0%");

    $(".progress").delay(ANIMATION_SPEED).fadeTo(ANIMATION_SPEED, 1);

}

/**
 * 根据请求进度, 更新加载进度条的显示
 */
function setProgressBar() {

    let $progressBar = $('.progress .progress-bar');
    let currentCount = (+$progressBar.attr("currentCount")) + 1;
    let totalCount = +$progressBar.attr("totalCount");

    $progressBar.attr("currentCount", currentCount);
    $progressBar.html(`${currentCount} / ${totalCount}`);
    $progressBar.css("width", (currentCount / totalCount) * 100 + "%");

    if (currentCount === totalCount) {
        $('.progress').delay(ANIMATION_SPEED).fadeTo(ANIMATION_SPEED, 0);
    }

}

/**
 * 从页面表单里获取选中快递的编号
 * @returns {string} 快递编号
 */
function getSelectedCourierCode() {
    return $('input[name=courier]:checked').val();
}

