# 极光记忆深处 - 部署指南

## 部署方式：GitHub Pages

### 1. 准备工作

1. **创建GitHub仓库**
   - 在GitHub上创建一个新的仓库
   - 将本地代码推送到GitHub仓库

### 2. 配置GitHub Pages

1. 访问GitHub仓库：`https://github.com/MiahanUser/GuoYuHan20060105.git`
2. 进入 `Settings > Pages`
3. 在 `Build and deployment` 部分：
   - Source: 选择 `GitHub Actions`
   - Framework preset: 选择 `Vite`

### 3. 部署流程

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/MiahanUser/GuoYuHan20060105.git
   git push -u origin main
   ```

2. **GitHub Actions自动部署**
   - 推送代码后，GitHub Actions会自动运行部署 workflow
   - 查看部署状态：`Actions`标签页

3. **访问部署的网站**
   - GitHub Pages会生成一个默认域名（如：https://miahanuser.github.io/GuoYuHan20060105/）
   - 可以在 `Settings > Pages` 中查看和配置域名

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

## 故障排除

1. **构建失败**
   - 检查依赖是否正确安装
   - 查看GitHub Actions日志获取详细错误信息

2. **部署失败**
   - 检查GitHub Pages配置是否正确
   - 确保仓库具有足够的权限

3. **网站无法访问**
   - 检查GitHub Pages部署状态
   - 查看浏览器控制台的错误信息

## 联系方式

如有任何问题，请联系项目维护者。
