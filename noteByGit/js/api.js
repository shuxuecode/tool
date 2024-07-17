
var newBranch = async function () {

    const defaultBranch = await getDefaultBranch()

    
    repo.branches(defaultBranch).fetch()
        .then((branchInfo) => {
            baseBranchSHA = branchInfo.commit.sha; // 获取SHA
            // 继续用这个SHA创建新分支


            var newBranchName = 'test'

            // 创建新分支的引用
            repo.git.refs.create({
                ref: `refs/heads/${newBranchName}`,
                sha: baseBranchSHA
            }).then(() => {
                console.log(`分支 ${newBranchName} 创建成功`);
            }).catch((error) => {
                console.error('创建新分支时出现错误: ', error);
            });



        })
        .catch((error) => {
            console.error('无法获取基准分支的SHA: ', error);
        });
}
