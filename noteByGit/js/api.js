
var createNewBranch = async function () {

    $branch = $('#branch').val().trim()

    if ($branch == '') {
        toastr.error("新分支为空")
        return;
    }

    const defaultBranch = await getDefaultBranch()


    repo.branches(defaultBranch).fetch()
        .then((branchInfo) => {
            baseBranchSHA = branchInfo.commit.sha; // 获取SHA
            // 继续用这个SHA创建新分支


            var newBranchName = $branch

            // 创建新分支的引用
            repo.git.refs.create({
                ref: `refs/heads/${newBranchName}`,
                sha: baseBranchSHA
            }).then(() => {
                console.log(`分支 ${newBranchName} 创建成功`);

                toastr.success(`分支 ${newBranchName} 创建成功`)

            }).catch((error) => {
                console.error('创建新分支时出现错误: ', error);
            });



        })
        .catch((error) => {
            console.error('无法获取基准分支的SHA: ', error);
        });
}


var deleteFile = function () {

    $filePath = document.getElementById('filePath').value

    if (repo == undefined || $filePath == '') {
        toastr.error("repo未配置")
        return
    }

    var config = {
        message: 'Deleting file',
        sha: sha
    }

    $branch = $('#branch').val().trim()
    if ($branch != '') {
        config.branch = $branch
    }

    repo.contents($filePath).remove(config)
        .then((result) => {
            console.log('File Deleted. result is ', result)
            toastr.info("删除成功")
        })
        .catch((error) => {
            console.error('An error occurred while deleting the file', error);
            toastr.error("删除失败")
        });
}


// GitHub API 并不直接支持重命名文件。要重命名文件，通常的做法是创建一个新文件并删除旧文件

var renameFile = function () {
// todo 
}
