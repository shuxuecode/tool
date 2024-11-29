






function setToken() {
    localStorage.setItem('love_github_token', $("#token").val());
    toastr.success("设置token成功")
}

function getToken() {
    var token = localStorage.getItem('love_github_token');
    $('#token').val(token)
}

function removeAll() {
    localStorage.removeItem('love_github_token');
    localStorage.removeItem('love_github_owner');
    localStorage.removeItem('love_github_repo');
    localStorage.removeItem('love_github_filepath');
}

// 
function setOwner() {
    localStorage.setItem('love_github_owner', document.getElementById('owner').value);
    toastr.success("设置owner成功")
}

function getOwner() {
    document.getElementById('owner').value = localStorage.getItem('love_github_owner');
}

// 
function setRepo() {
    localStorage.setItem('love_github_repo', document.getElementById('repo').value);

    $token = document.getElementById('token').value
    $owner = document.getElementById('owner').value
    $repo = document.getElementById('repo').value
    
    if ($token == '' || $owner == '' || $repo == '') {
        toastr.error("配置为空")
        return false
    }

    octo = new Octokat({ token: $token })
    repo = octo.repos($owner, $repo)

    toastr.success("设置repo成功")
}

function getRepo() {
    document.getElementById('repo').value = localStorage.getItem('love_github_repo');
}

function setBranch() {
    localStorage.setItem('my_github_branch', document.getElementById('branch').value);
    toastr.success("设置分支成功")
}

function getBranch() {
    document.getElementById('branch').value = localStorage.getItem('my_github_branch');
}

// 
function setFilePath() {
    localStorage.setItem('love_github_filepath', document.getElementById('filePath').value);
    toastr.success("设置filePath成功")
}

function getFilePath() {
    document.getElementById('filePath').value = localStorage.getItem('love_github_filepath');
}




var octo = undefined
var repo = undefined

var $token = undefined
var $owner = undefined
var $repo = undefined


var initRepo = function () {
    $token = document.getElementById('token').value
    $owner = document.getElementById('owner').value
    $repo = document.getElementById('repo').value

    if ($token == '' || $owner == '' || $repo == '') {
        toastr.error("配置为空")
        return false
    }

    octo = new Octokat({ token: $token })
    repo = octo.repos($owner, $repo)
}


var check = function () {

    if ($('#token').val().trim() === '') {
        $('#h2id').html("token未设置")
        $('#h2id').css({ "color": "red" })
        return;
    }

    if ($('#owner').val().trim() === '') {
        $('#h2id').html("owner未设置")
        $('#h2id').css({ "color": "red" })
        return;
    }

    if ($('#repo').val().trim() === '') {
        $('#h2id').html("repo未设置")
        $('#h2id').css({ "color": "red" })
        return;
    }

}


var init = function () {

    // 绑定事件
    document.getElementById('updateToken').onclick = setToken;
    document.getElementById('updateOwner').onclick = setOwner;
    document.getElementById('updateRepo').onclick = setRepo;

    // document.getElementById('pullBtn').onclick = pullContent;
    // document.getElementById('pushBtn').onclick = pushContent;

    // 初始化内容
    getToken();
    getOwner();
    getRepo();

    // 前置检查
    check();

    // 加载配置
    initRepo();

    if (repo != undefined) {
        $('#h2id').html("repo加载成功")
        $('#h2id').css({ "color": "green" })
    }
}


init()

query()

// create('API创建标题', '内容')