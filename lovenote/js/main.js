






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
var sha = undefined;

var $token = undefined
var $owner = undefined
var $repo = undefined
var $branch = ''
var $filePath = undefined


var initRepo = function () {
    $token = document.getElementById('token').value
    $owner = document.getElementById('owner').value
    $repo = document.getElementById('repo').value
    $filePath = document.getElementById('filePath').value

    if ($token == '' || $owner == '' || $repo == '') {
        toastr.error("配置为空")
        return false
    }

    octo = new Octokat({ token: $token })
    repo = octo.repos($owner, $repo)
}

var pullContent = function () {

    if (repo === undefined) {
        toastr.error("repo未设置")
        return
    }

    $branch = $('#branch').val().trim()

    repo.contents($filePath)
        // .read({ref: $branch})
        .fetch({ref: $branch})
        .then((info) => {
            console.log(info)
            // console.log(info.sha, info.content)
            sha = info.sha
            showTitle("sha=" + sha)
            var contents = base64Decode(info.content)
            // var contents = info
            document.getElementById("content").value = contents;

            // 预览
            showPreview(contents);

            toastr.info("pull成功")
        });
}

var pushContent = function () {
    
    $filePath = document.getElementById('filePath').value

    if (repo == undefined || $filePath == '') {
        toastr.error("repo未配置")
        return
    }

    var text = document.getElementById("content").value

    var config = {
        message: 'Updating file',
        content: base64Encode(text),
        sha: sha, // the blob SHA
        // branch: ''
    }

    $branch = $('#branch').val().trim()
    if ($branch != '') {
        config.branch = $branch
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









// 使用 .branches 方法来获取所有分支的信息
async function getBranchList() {

    const defaultBranch = await getDefaultBranch()

    // console.error(defaultBranch)

    repo.branches.fetch()
        .then(branches => {
            
            var html = ''

            console.warn('branches', branches)
            // `branches` 将是一个包含仓库所有分支信息的数组
            branches.items.forEach(branch => {
                // console.log(branch.name); // 打印分支名称

                html += '<div class="">'
                html += '<button onclick="chooseBranch(this)">使用该分支</button>'
                if(defaultBranch === branch.name) {
                    html += '<span class="branCls"> ' + branch.name + '</span> '
                } else {
                    html += '<span class=""> ' + branch.name + '</span> '
                }
                
                html += '</div> '
            });

            $('#branchList').html(html)
            // 
        })
        .catch(error => {
            console.error('Error fetching branches: ', error);
        });
    
}


async function getDefaultBranch() {
    return new Promise((resolve, reject) => {
        // 这里进行异步操作
        // 获取仓库信息
        repo.fetch()
            .then(repoInfo => {
                console.log('默认分支=', repoInfo.defaultBranch); // 打印默认分支的名称
                resolve(repoInfo.defaultBranch);
            })
            .catch(error => {
                console.error('Error fetching repository information: ', error);
            });
      });
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
    document.getElementById('updateFilePath').onclick = setFilePath;

    document.getElementById('pullBtn').onclick = pullContent;
    document.getElementById('pushBtn').onclick = pushContent;

    // 初始化内容
    getToken();
    getOwner();
    getRepo();
    getFilePath();

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