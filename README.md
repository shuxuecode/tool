# Tool

Tool 是一个纯静态、无后端服务的在线工具箱。项目以 `index.html` 作为统一入口，通过左侧导航和内嵌 `iframe` 加载各个独立 HTML 工具，支持工具搜索、深浅色主题、侧边栏折叠、路由定位以及新窗口打开。

## 工具列表

### 开发工具

- [JSON 格式化](./json/JSONFormat/index.html)：JSON 校验、格式化、压缩以及 JSON 与 XML 互转。
- [JSON 快速格式化](./json/jsonformat.html)：轻量版 JSON 解析、验证与格式化。
- [时间戳转换](./toolbox/timestamp.html)：时间戳与日期互转，并计算时间间隔。
- [进制转换](./common/radix-converter.html)：支持 2~36 进制数字互转。
- [Mermaid 编辑器](./common/mermaid-editor.html)：实时编辑并渲染 Mermaid 图表。

### 笔记与待办

- [GitHub 笔记](./noteByGit/index.html)：通过 GitHub API 管理仓库文件、分支、Markdown 笔记和 Issue。
- [一封情书](./lovenote/index.html)：富文本编辑，并将内容保存到指定 GitHub 仓库文件。
- [GitHub 待办](./todolist/index.html)：使用 GitHub Issues 创建和管理待办任务。

### 转换与文本

- [图片转 Base64](./toolbox/image2Base64.html)：将本地图片转换为 Data URL。
- [二维码工具](./common/qrcode.html)：生成二维码并解析图片中的二维码。
- [字数统计](./common/char-counter.html)：统计字符、汉字、英文单词等信息。

## 本地运行

项目不需要构建步骤或 Node.js 依赖，只需启动任意静态文件服务器：

```sh
python3 -m http.server 8080
```

然后访问 `http://localhost:8080/`。

也可以直接用浏览器打开 `index.html`。不过部分工具依赖 CDN 资源、剪贴板能力或 iframe 加载，使用本地 HTTP 服务可以获得更完整、更稳定的体验。

## GitHub 工具配置

GitHub 笔记、一封情书和 GitHub 待办都使用浏览器直接请求 GitHub API。首次使用时，在工具的“设置”面板中填写：

- GitHub Personal Access Token：建议只授予对应仓库或 Issue 的最小权限。
- Owner：GitHub 用户名或组织名。
- Repo：仓库名称。
- Branch / FilePath：仅 GitHub 笔记和一封情书需要，用于指定保存位置。

这些配置会保存在当前浏览器的 `localStorage` 中，不会上传到项目自带的后端，因为项目本身没有后端。请在自己信任的浏览器和环境中使用；更换设备或清理浏览器数据后需要重新填写。

## 目录结构

```text
.
├── index.html                # 工具箱统一入口
├── assets/                   # 图标资源
├── common/                   # 通用小工具
├── gzip/                     # JS 压缩相关工具
├── json/                     # JSON 处理工具
├── lovenote/                 # 富文本情书工具
├── noteByGit/                # GitHub 笔记工具
├── toolbox/                  # 时间戳、图片转换等基础工具
├── todolist/                 # GitHub Issues 待办工具
├── My97DatePicker/           # 日期控件依赖
└── upload.sh                 # 旧的 git pull/add/commit/push 辅助脚本
```

## 部署

所有页面和资源均为静态文件，可将整个项目目录部署到 GitHub Pages、Netlify、Vercel、Cloudflare Pages、Nginx 或任意静态文件托管服务。部署后以 `index.html` 作为入口即可。

## 注意事项

- Mermaid、二维码库和部分 JSON 工具依赖外部 CDN，需要浏览器可访问对应网络资源。
- GitHub 工具依赖 GitHub API 的跨域请求能力，请确保网络可访问 GitHub。
- `index2.html` 和 `toolbox/time.html` 更偏历史或测试页面，未纳入统一工具导航。
- `upload.sh` 会执行 `git add .` 并使用随机 emoji 生成提交信息，使用前请确认改动范围，日常开发更建议手动提交。

## License

[MIT](./LICENSE)

