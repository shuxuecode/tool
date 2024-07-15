






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
    toastr.success("设置owner成功")
}

function getOwner() {
    document.getElementById('owner').value = localStorage.getItem('my_github_owner');
}

// 
function setRepo() {
    localStorage.setItem('my_github_repo', document.getElementById('repo').value);
    toastr.success("设置repo成功")
}

function getRepo() {
    document.getElementById('repo').value = localStorage.getItem('my_github_repo');
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
    localStorage.setItem('my_github_filepath', document.getElementById('filePath').value);
    toastr.success("设置filePath成功")
}

function getFilePath() {
    document.getElementById('filePath').value = localStorage.getItem('my_github_filepath');
}




var octo = undefined
var repo = undefined
var sha = undefined;

var $token = undefined
var $owner = undefined
var $repo = undefined
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


var addFile = function () {
    if (repo == undefined) {
        toastr.error("repo未配置")
        return
    }

    $filePath = document.getElementById('filePath').value
    if ($filePath == '') {
        toastr.error("文件路径未配置")
        return
    }

    var text = document.getElementById("content").value

    var config = {
        message: 'add file', // commit信息
        content: base64Encode(text)
    }

    repo.contents($filePath).add(config)
        .then((result) => {
            console.log('File add success. result is ', result)

            toastr.info("添加成功")
            // 重新拉取
            // pullContent()
        }).catch(error => {
            console.error("Failed to create file: ", error)
        })
}



var getFileList = function () {

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

    repo.contents('')
        .read({ref: ''})
        // .fetch()
        .then(contents => {
    // repo.contents($filePath).fetch().then(contents => {
        // 'contents' is an array of files and directories in the repository's root
        //   console.log(contents)
        //   console.log(contents.items)

        var html = ''

        contents.items.forEach(file => {
            console.log(`path: ${file.path}, type: ${file.type}`);

            if (file.type == 'dir') {
                html += '<div class="_dir">'
                html += '<button onclick="expandFile(this)" style="color: blue;">展开</button>'
                html += '<span class="dirCls"> ' + file.path + '</span> '
                html += '</div> '
            } else {
                // html += '<div onclick="setNewFilePath(this)">' + file.path + '</div>'
                html += '<div class="_dir">'
                html += '<button onclick="openFile(this)">打开</button>'
                html += '<span class="dirCls2"> ' + file.path + '</span> '
                html += '</div> '
            }

        });

        $('#fileList').html(html)
    });
}

function expandFile(e) {
    // console.info($(e))
    // console.info($(e).next())
    // 获取文件路径
    // console.info($(e).next().text())
    var filePath = $(e).next().text().trim()

    repo.contents(filePath)
        // .read({ref: ''})    
        .fetch()
        .then(contents => {

        var html = ''

        contents.items.forEach(file => {
            console.log(`path: ${file.path}, type: ${file.type}`);

            if (file.type == 'dir') {
                html += '<div class="_dir">'
                html += '<button onclick="expandFile(this)" style="color: blue;">展开</button>'
                html += '<span class="dirCls"> ' + file.path + '</span> '
                html += '</div> '
            } else {
                // html += '<div onclick="setNewFilePath(this)">' + file.path + '</div>'
                html += '<div class="_dir">'
                html += '<button onclick="openFile(this)">打开</button>'
                html += '<span class="dirCls2"> ' + file.path + '</span> '
                html += '</div> '
            }

        });

        // $(e).parent().after(html)
        $(e).parent().append(html)
    });
    
    // 禁用按钮
    $(e).prop('disabled', true);
    // 
    $(e).css({'color':'lightgray'});
}


function openFile(e) {

    var filePath = $(e).next().text().trim()

    // 更新路径
    $("#filePath").val(filePath)

    repo.contents(filePath).fetch()
        .then((info) => {
            // console.log(info.sha, info.content)
            sha = info.sha
            showTitle("sha=" + sha)
            var contents = base64Decode(info.content)
            document.getElementById("content").value = contents;

            toastr.info("pull成功")
        });

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


function chooseBranch(e) {

    var branch = $(e).next().text().trim()

    // 更新分支
    $("#branch").val(branch)
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
    document.getElementById('updateBranch').onclick = setBranch;
    document.getElementById('updateFilePath').onclick = setFilePath;

    document.getElementById('pullBtn').onclick = pullContent;
    document.getElementById('pushBtn').onclick = pushContent;
    document.getElementById('addFileBtn').onclick = addFile;
    

    $('#getFileBtn').on('click', function () {
        getFileList()
    })

    $('#getBranchBtn').on('click', function () {
        getBranchList()
    })
    

    // 初始化内容
    getToken();
    getOwner();
    getRepo();
    getBranch();
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