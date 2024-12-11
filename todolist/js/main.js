
// 
var octo = undefined
var repo = undefined

var $token = undefined
var $owner = undefined
var $repo = undefined


// 基础配置
function setToken() {
    localStorage.setItem('todolist_github_token', $("#token").val());
    toastr.success("设置token成功")
}

function getToken() {
    $('#token').val(localStorage.getItem('todolist_github_token'))
}

// 
function setOwner() {
    localStorage.setItem('todolist_github_owner', document.getElementById('owner').value);
    toastr.success("设置owner成功")
}

function getOwner() {
    document.getElementById('owner').value = localStorage.getItem('todolist_github_owner');
}

// 
function setRepo() {
    localStorage.setItem('todolist_github_repo', document.getElementById('repo').value);

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
    document.getElementById('repo').value = localStorage.getItem('todolist_github_repo');
}

// 移除所有的配置
function removeAll() {
    localStorage.removeItem('todolist_github_token');
    localStorage.removeItem('todolist_github_owner');
    localStorage.removeItem('todolist_github_repo');
}


/**
 * 初始化repo
 */
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


/**
 * 前置检查
 */
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


/**
 * 初始化
 */
var init = function () {

    // 绑定事件
    document.getElementById('updateToken').onclick = setToken;
    document.getElementById('updateOwner').onclick = setOwner;
    document.getElementById('updateRepo').onclick = setRepo;

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

        // 查询
        query();
    }
}


init()



// create('API创建标题', '内容')