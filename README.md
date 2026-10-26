# 台词打字机

听一句、打一句，打错整句重来。剧本是 `scripts/` 里的 JSON 文件，推到 GitHub 就能自动部署。

## 目录

```
index.html                  页面（单文件）
scripts/
  老友记/                    文件夹名 = 剧名
    S01E01.json             一个文件 = 一集
    S01E02.json
  index.json                自动生成，不用手写
tools/build-index.mjs       生成 index.json 并检查格式
.github/workflows/pages.yml 推送后自动部署
```

## 部署到 GitHub Pages

1. 新建仓库，把这个文件夹的内容推上去（分支 main）。
2. 仓库 Settings → Pages → Source 选 **GitHub Actions**。
3. 之后每次 push 都会自动检查 JSON、生成 `scripts/index.json` 并发布。地址是 `https://<用户名>.github.io/<仓库名>/`。

某个 JSON 格式有误时，Actions 会失败并指出是哪个文件，网站保持上一个可用版本。

## 加剧本

把新的 `.json` 放进 `scripts/<剧名>/`，提交并 push 即可。

```json
{
  "show": "My Show",
  "episode": "S01E01 Pilot",
  "order": 1,
  "lines": [
    {"speaker": "Maya", "text": "Good morning! You look tired.", "zh": "早上好！你看起来很累。"},
    {"speaker": "Ben", "text": "I didn't sleep at all."}
  ]
}
```

- `show` 可省略，省略时用文件夹名。`order` 决定集数顺序，省略则按文件名排序。
- 一个文件里也可以写 `{"show": "...", "episodes": [{...}, {...}]}`。
- 台词可以简写成 `["人名", "English", "中文"]`。
- `[ ]`、`( )` 里的舞台说明会自动删掉，弯引号和长破折号会换成键盘能打的字符。

## 本地预览

浏览器不允许直接双击打开的页面读取同目录文件，请起一个本地服务：

```
node tools/build-index.mjs
python3 -m http.server 8000
```

然后访问 http://localhost:8000 。

## 不想用 Actions

运行 `node tools/build-index.mjs`，把生成的 `scripts/index.json` 一起提交，然后在 Settings → Pages 选 Deploy from a branch → main / root。每次改剧本都要重新生成一次 index.json。

## 版权

请只提交你有权使用的台词。公开仓库和公开网页意味着任何人都能看到这些 JSON。
