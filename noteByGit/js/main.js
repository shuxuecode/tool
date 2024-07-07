






function setToken() {
    localStorage.setItem('my_github_token', $("#token").val());
    toastr.success("设置token成功")
}

function getToken() {
    var token = localStorage.getItem('my_github_token');
    $('#token').val(token)
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


var getConfig = function () {
    $token = document.getElementById('token').value
    $owner = document.getElementById('owner').value
    $repo = document.getElementById('repo').value
    $filePath = document.getElementById('filePath').value

    if($token == '' || $owner == '' || $repo == '' || $filePath == '') {
        toastr.error("配置为空")
        return false
    }

    octo = new Octokat({ token: $token })
    repo = octo.repos($owner, $repo)

    return true
}

var pullContent = function () {

    if (getConfig() === false) {
        return
    }

    // repo.contents($filePath).read() // Use `.read` to get the raw file.
    //     .then((contents) => {        // `.fetch` is used for getting JSON
    //         console.log(contents)
    //         document.getElementById("content").value = contents;
    //     });

    repo.contents($filePath).fetch()
        .then((info) => {
            // console.log(info.sha, info.content)
            sha = info.sha
            showTitle("sha=" + sha)
            var contents = base64Decode(info.content)
            document.getElementById("content").value = contents;

            toastr.info("pull成功")
        });
}

var pushContent = function () {

    if(repo == undefined || $filePath == '') {
        toastr.error("repo未配置")
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
            // sha = info.commit.sha
            // showTitle("sha=" + sha)

            toastr.info("推送成功")

            // 重新拉取
            pullContent()
        })
}




var getFileList = function () {
   
    $token = document.getElementById('token').value
    $owner = document.getElementById('owner').value
    $repo = document.getElementById('repo').value
    $filePath = document.getElementById('filePath').value

    if($token == '' || $owner == '' || $repo == '') {
        toastr.error("配置为空")
        return false
    }

    octo = new Octokat({ token: $token })
    repo = octo.repos($owner, $repo)

    // repo.contents('').fetch().then(contents => {
    repo.contents($filePath).fetch().then(contents => {
        // 'contents' is an array of files and directories in the repository's root
        //   console.log(contents)
        //   console.log(contents.items)

        var html = ''

        contents.items.forEach(file => {
            console.log(`path: ${file.path}, type: ${file.type}`);

            if (file.type == 'dir') {
                html += '<li onclick="setNewFilePath(this)" class="dirCls">' + file.path + '</li>'
            } else {
                html += '<li onclick="setNewFilePath(this)">' + file.path + '</li>'
            }
            
        });

        $('#fileList').html(html)
    });
}


function setNewFilePath(e){
    console.info(e)
    console.info($(e))
    console.info($(e).text())
}



var init = function () {

    // 绑定事件
    document.getElementById('updateToken').onclick = setToken;

    document.getElementById('updateOwner').onclick = setOwner;

    document.getElementById('updateRepo').onclick = setRepo;

    document.getElementById('updateFilePath').onclick = setFilePath;

    document.getElementById('pullBtn').onclick = pullContent;
    document.getElementById('pushBtn').onclick = pushContent;

    $('#getFileBtn').on('click', function(){
        getFileList()
    })

    // 初始化内容
    getToken();
    getOwner();
    getRepo();
    getFilePath();
}


init()