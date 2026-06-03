# Destination — 倒计时应用

基于 Vite + React 19 + TypeScript 6 的倒计时页面，支持到达目标时间后自动切换为正计时，集成天气显示。

## 技术栈

| 技术 | 版本 |
|---|---|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| TDesign React | 1.17 |
| Axios | 1.16 |

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build        # tsc -b && vite build

# 代码检查
npm run lint

# 预览构建产物
npm run preview
```

## 环境变量

所有变量以 `VITE_` 开头，构建时注入。本地开发复制 `.env.example` 为 `.env`。

| 变量 | 默认值 | 说明 |
|---|---|---|
| `VITE_COUNTDOWN_NAME` | `2026年12月18日` | 倒计时目标名称 |
| `VITE_COUNTDOWN_DATE` | `2026-12-18T00:00:00+08:00` | ISO 8601 目标时间（含时区） |
| `VITE_COUNTDOWN_TITLE` | `倒计时` | 浏览器标签页标题 |

## Node.js 版本

项目需要 Node.js 18+。根目录 `.node-version` 指定了 Vercel 使用的版本。

## Vercel 部署

### 仓库结构注意

项目代码在 `destination/` 子目录中，部署时需要指定 **Root Directory**。

```
DestinationTime/
├── vercel.json          ← Vercel 配置（仓库根目录）
├── .node-version        ← Node 版本（20）
├── destination/         ← 项目源码
│   ├── package.json
│   ├── src/
│   └── ...
```

### 部署步骤

**1. 导入项目**

- 打开 [vercel.com](https://vercel.com) → **Add New Project**
- 导入 GitHub 仓库 `ByHarold/DestinationTime`

**2. 设置 Root Directory（必须）**

- 项目 Dashboard → **Settings → General**
- 找到 **Root Directory**，填入 `destination`
- 点击 **Save**
- 不设置此项会导致部署失败（`ENOENT package.json`）

**3. 设置环境变量**

- **Settings → Environment Variables**
- 添加以下变量：

| Name | Value |
|---|---|
| `VITE_COUNTDOWN_NAME` | `2026年12月18日` |
| `VITE_COUNTDOWN_DATE` | `2026-12-18T00:00:00+08:00` |
| `VITE_COUNTDOWN_TITLE` | `倒计时 - 2026年12月18日` |

> 也可在仓库中创建 `.env` 文件，构建时自动读取。

**4. 配置域名（可选）**

- **Settings → Domains**
- 添加自定义域名（如 `time.webspacex.eu.org`）
- 在域名 DNS 管理中添加 CNAME 记录指向 `cname.vercel-dns.com`

**5. 部署**

- 推送到 `master` 分支会自动触发部署
- 也可在 **Deployments** 页面手动点击 **Redeploy**

### 项目配置（vercel.json）

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> `vercel.json` 位于**仓库根目录**（不是 `destination/` 内）。

## 功能

- **倒计时**：到指定目标日期（环境变量控制），每秒更新
- **正计时**：到达目标后自动切换为已过时间
- **今日剩余**：显示当天还剩多少小时/分钟
- **当前时间**：实时显示当前日期与时间
- **天气显示**：基于 IP 定位自动获取当地天气与体感温度（Open-Meteo API，无需 Key）
- **时间感知背景**：根据时段（早晨/中午/下午/晚上）自动切换背景色与强调色
- **响应式布局**：适配桌面端与移动端
- **深色主题**：全局深色配色
