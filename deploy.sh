#!/bin/bash
# 文书查官网 · 一条命令部署到 GitHub Pages
# 用法：./deploy.sh
# 原理：构建子路径版本 → 把 dist 产物推送到 gh-pages 分支 → GitHub Pages 自动生效
# 之后每次更新内容，跑这一条命令即可（无需手动 git 操作）
set -e
cd "$(dirname "$0")"

# 兜底：本机 managed node 不在系统 PATH 时补上（其他机器若 npm 可用则跳过）
command -v npm >/dev/null 2>&1 || export PATH="/Users/bowen/.workbuddy/binaries/node/versions/22.22.2/bin:$PATH"

echo "[1/4] 构建子路径版本..."
ASTRO_BASE=/wenshucha-site/ npm run build

echo "[2/4] 切换 gh-pages 分支..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
else
  git checkout --orphan gh-pages
fi

echo "[3/4] 同步构建产物..."
git rm -rfq . >/dev/null 2>&1 || true
cp -r dist/. .
rm -rf dist
git add -A
git commit -m "deploy $(date +%Y-%m-%d_%H%M)" >/dev/null 2>&1 || echo "（无变更）"
git push origin gh-pages --force

echo "[4/4] 回到 main 分支..."
git checkout main
echo "✅ 部署完成，1-2 分钟后生效：https://bovenlawforedu.github.io/wenshucha-site/"
