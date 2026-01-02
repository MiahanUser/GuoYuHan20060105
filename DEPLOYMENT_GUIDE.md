# 极光记忆深处 - 部署指南

## 部署方式：GitHub + Cloudflare Pages

### 1. 准备工作

1. **创建GitHub仓库**
   - 在GitHub上创建一个新的仓库
   - 将本地代码推送到GitHub仓库

2. **配置Cloudflare账户**
   - 注册/登录Cloudflare账户
   - 在Cloudflare Pages中创建一个新项目

### 2. 配置GitHub Secrets

在GitHub仓库的`Settings > Secrets and variables > Actions`中添加以下Secrets：

- `CLOUDFLARE_API_TOKEN`：Cloudflare API令牌（需要Pages编辑权限）
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare账户ID

### 3. 部署流程

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/aurora-memory-deep.git
   git push -u origin main
   ```

2. **GitHub Actions自动部署**
   - 推送代码后，GitHub Actions会自动运行部署 workflow
   - 查看部署状态：`Actions`标签页

3. **访问部署的网站**
   - Cloudflare Pages会生成一个默认域名（如：aurora-memory-deep.pages.dev）
   - 可以在Cloudflare Pages控制台中配置自定义域名

### 4. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

### 5. 环境变量配置

1. 在项目根目录创建`.env.local`文件
2. 添加以下环境变量：
   ```
   GEMINI_API_KEY=your-gemini-api-key
   ```

### 6. Cloudflare Tunnel替代方案

如果需要使用Cloudflare Tunnel进行本地预览或测试，可以使用以下命令：

```bash
# 安装cloudflared
npm install -g cloudflared

# 登录Cloudflare
cloudflared tunnel login

# 创建隧道
cloudflared tunnel create aurora-memory-deep

# 运行隧道
cloudflared tunnel run --url http://localhost:3000 aurora-memory-deep
```

## 故障排除

1. **构建失败**
   - 检查依赖是否正确安装
   - 检查环境变量是否配置正确

2. **部署失败**
   - 检查GitHub Secrets是否正确配置
   - 检查Cloudflare API令牌权限

3. **网站无法访问**
   - 检查Cloudflare Pages部署状态
   - 检查域名解析是否正确

## 联系方式

如有任何问题，请联系项目维护者。
