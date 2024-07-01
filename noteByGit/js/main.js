






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




function setToken() {
    var token = document.getElementById('token').value;
    localStorage.setItem('my_github_token', token);
}

function getToken() {
    var token = localStorage.getItem('my_github_token');
    document.getElementById('token').value = token;
}

function removeAll() {
    localStorage.removeItem('my_github_token');
    localStorage.removeItem('my_github_owner');
    localStorage.removeItem('my_github_repo');
    localStorage.removeItem('my_github_filepath');
}

// 
function setOwner() {
    localStorage.setItem('my_github_owner', document.getElementById('owner').value);
}

function getOwner() {
    document.getElementById('owner').value = localStorage.getItem('my_github_owner');
}

// 
function setRepo() {
    localStorage.setItem('my_github_repo', document.getElementById('repo').value);
}

function getRepo() {
    document.getElementById('repo').value = localStorage.getItem('my_github_repo');
}

// 
function setFilePath() {
    localStorage.setItem('my_github_filepath', document.getElementById('filePath').value);
}

function getFilePath() {
    document.getElementById('filePath').value = localStorage.getItem('my_github_filepath');
}


var showTitle = function (msg) {
    document.getElementById("titleId").innerHTML = msg;
}


function base64Encode(input) {
    return window.btoa(unescape(encodeURIComponent(input)));
}



var octo = undefined
var repo = undefined
var sha = undefined;

var $token = undefined
var $owner = undefined
var $repo = undefined
var $filePath = undefined


var pullContent = function () {

    $token = document.getElementById('token').value
    $owner = document.getElementById('owner').value
    $repo = document.getElementById('repo').value
    $filePath = document.getElementById('filePath').value

    if($token == '' || $owner == '' || $repo == '' || $filePath == '') {
        showTitle("配置为空")
        return
    }

    octo = new Octokat({ token: $token })
    repo = octo.repos($owner, $repo)

    // repo.contents($filePath).read() // Use `.read` to get the raw file.
    //     .then((contents) => {        // `.fetch` is used for getting JSON
    //         console.log(contents)
    //         document.getElementById("content").value = contents;
    //     });

    repo.contents($filePath).fetch()
        .then((info) => {
            // console.log(info.sha, info.content)
            sha = info.sha
            
            var contents = base64Decode(info.content)
            document.getElementById("content").value = contents;
        });
}

var pushContent = function () {

    if(repo == undefined || $filePath == '') {
        showTitle("repo未配置")
        return
    }

    var text = document.getElementById("content").value

    var config = {
        message: 'Updating file',
        content: base64Encode(text),
        sha: sha, // the blob SHA
        // branch: 'gh-pages'
    }

    repo.contents($filePath).add(config)
        .then((info) => {
            console.log('File Updated. new sha is ', info.commit.sha)
            sha = info.commit.sha
        })
}



var init = function () {

    // 绑定事件
    document.getElementById('updateToken').onclick = setToken;
    document.getElementById('showToken').onclick = getToken;

    document.getElementById('updateOwner').onclick = setOwner;
    document.getElementById('showOwner').onclick = getOwner;

    document.getElementById('updateRepo').onclick = setRepo;
    document.getElementById('showRepo').onclick = getRepo;

    document.getElementById('updateFilePath').onclick = setFilePath;
    document.getElementById('showFilePath').onclick = getFilePath;

    document.getElementById('pullBtn').onclick = pullContent;
    document.getElementById('pushBtn').onclick = pushContent;


    // 初始化内容
    getToken();
    getOwner();
    getRepo();
    getFilePath();
}


init()