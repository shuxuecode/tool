
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


var deleteFileFun = function () {

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

var renameFile = function (newFileName) {
// todo 
    if (newFileName == $filePath) {
        toastr.error("文件名一模一样，请修改")
        return
    }

    $branch = $('#branch').val().trim()

    // 第一阶段：获取旧文件的内容和 SHA
    repo.contents($filePath)
        .fetch({ref: $branch})
        .then((info) => {

            var config = {
                message: `Rename file ${$filePath} to ${newFileName}`, // commit信息
                content: info.content
            }
            if ($branch != '') {
                config.branch = $branch
            }
            
            // 第二阶段：创建新文件
            repo.contents(newFileName).add(config)
                .then((result) => {
                    console.log('File add success. result is ', result)
        
                    // toastr.info("添加成功")
                    // 重新拉取
                    // pullContent()


                    var config = {
                        message: 'Deleting file',
                        sha: info.sha
                    }
                
                    if ($branch != '') {
                        config.branch = $branch
                    }
                
                    // 第三阶段：删除旧文件
                    repo.contents($filePath).remove(config)
                        .then((res) => {
                            console.log('File Deleted. result is ', res)
                            toastr.info("重命名成功")
                            // 更新文件名
                            document.getElementById('filePath').value = newFileName

                        })
                        .catch((err) => {
                            console.error('An error occurred while deleting the file', err);
                            toastr.error("删除失败")
                        });

                }).catch(error => {
                    console.error("Failed to create file: ", error)
                })

        });
}


// 创建issue
var createIssuesFun = function () {

    if (repo == undefined) {
        toastr.error("repo未配置")
        return
    }

    var issues = document.getElementById("issueContent").value;
    if (issues == '') {
        toastr.error("issue内容为空")
        return
    }

    repo.issues.create({
        title: 'Issue 标题',
        body: issues
      })
      .then(response => {
        console.log('Issue 创建成功:', response);
        toastr.info("创建成功")
      })
      .catch(error => {
        console.error('创建 Issue 时出错:', error);
        toastr.error("创建失败")
      });

}