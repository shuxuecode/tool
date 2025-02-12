

function query() {
    repo.issues.fetch({
      state: 'all', // 拉取打开的 issue，可以设置为 'closed' 或 'all' open
      per_page: 5,  // 每页的 issue 数量，可以根据需要调整
      sort: 'created',   // 按创建时间排序
      direction: 'desc'  // 按降序排序
    })
      .then(res => {
        console.log('res : ', JSON.stringify(res));
        // console.log(res.items);
  
        res.items.forEach(issue => {
          console.log('--------------------------------------------------------------');
          console.log(issue.number);
          console.log(issue.title);
          console.log(issue.body);
          console.log(issue.state);
          console.log(issue.updatedAt);
          console.log(new Date(new Date(issue.updatedAt).getTime() + 8 * 3600 * 1000));
  
          console.error('666')
  
          show(issue)
  
        });
  
      })
      .catch(error => {
        console.error('Error fetching issues: ', error);
      });
  }



  function update(issueNumber, title, issues, state) {
    repo.issues(7).update({
      title: title,
      body: issues,
      state: state
    })
      .then(res => {
        console.log('res update : ', JSON.stringify(res));
      })
      .catch(error => {
        console.error('Error update issues: ', error);
      });
  }
  
  
  function add() {

    const title = document.getElementById('add_title').value
    const issues = document.getElementById('add_content').value

    // todo 
    create(title, issues)

  }
  
  function create(title, issues) {
    repo.issues.create({
      title: title,
      body: issues
    })
      .then(response => {
        console.log('Issue 创建成功:', response);
      })
      .catch(error => {
        console.error('创建 Issue 时出错:', error);
      });
  }


var createNewBranch = async function () {
    
}




var show = function(data) {

    var html = '<div class="list-item">'

    html += '<input type="checkbox" class="checkbox" ' + (data.state == 'closed' ? 'checked' : '') + '>'

    html += '<div class="content">'
    html += '<p class="title">' + data.title + '</p>'
    html += '<p class="description">' + data.body + '</p>'
    html += '</div>'
    // html += '<div class="date">' + new Date(new Date(data.updatedAt).getTime()) + '</div>'
    html += '<div class="date">' + formatTimestamp(new Date(data.updatedAt)) + '</div>'
    html += '</div>'

    $('.list-container').append(html);

    // console.log(issue.number);
    // console.log(issue.title);
    // console.log(issue.body);
    // console.log(issue.state);
    // console.log(issue.updatedAt);
    // console.log(new Date(new Date(issue.updatedAt).getTime() + 8 * 3600 * 1000));

}




function formatTimestamp(date) {
    // 创建一个新的日期对象
    // const date = new Date(timestamp);
    
    // 获取年、月、日、小时、分钟和秒
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    // 格式化输出为 "YYYY-MM-DD HH:MM:SS"
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}