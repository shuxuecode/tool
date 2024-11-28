

// Base64 编码中文字符串
function base64Encode(str) {
    // 对字符串进行URL编码，然后转换每个编码后的字符段为二进制序列
    const binaryStr = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        });

    // 使用btoa将二进制字符串编码为Base64字符串
    return btoa(binaryStr);
}



// Base64 解码字符串（包括中文）
function base64Decode(base64EncodedString) {
    // 使用atob解码Base64字符串为二进制字符串
    const binaryStr = atob(base64EncodedString);

    // 然后把这个字符串转换为普通字符的URL编码形式
    const codeUnits = new Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        codeUnits[i] = binaryStr.charCodeAt(i);
    }

    const uriComponent = codeUnits
        .map(ch => '%' + ('00' + ch.toString(16)).slice(-2))
        .join('');

    // 使用decodeURIComponent得到原始字符串
    return decodeURIComponent(uriComponent);
}


var showTitle = function (msg) {
    document.getElementById("titleId").innerHTML = msg;
}


function base64Encode(input) {
    return window.btoa(unescape(encodeURIComponent(input)));
}

