#!/bin/bash
# 文书查官网 · 一条命令部署到 GitHub Pages（临时目录方案，不污染源码工作区）
# 用法：./deploy.sh
# 原理：构建子路径版本 → 在临时目录拉取 gh-pages 分支并替换产物 → push → 清理
set -e
cd "$(dirname "$0")"
SRC="$(pwd)"

# 兜底：本机 managed node 不在系统 PATH 时补上（其他机器若 npm 可用则跳过）
command -v npm >/dev/null 2>&1 || export PATH="/Users/bowen/.workbuddy/binaries/node/versions/22.22.2/bin:$PATH"

echo "[1/4] 构建子路径版本..."
ASTRO_BASE=/wenshucha-site/ npm run build

echo "[2/4] 在临时目录准备 gh-pages 分支..."
TMPD="$(mktemp -d)"
cd "$TMPD"
git init -q
git remote add origin "$(git -C "$SRC" remote get-url origin)"
git fetch -q origin gh-pages 2>/dev/null || git fetch -q origin || true
if git rev-parse --verify gh-pages >/dev/null 2>&1; then
  git checkout -q gh-pages
else
  git checkout -q --orphan gh-pages
fi

echo "[3/4] 同步构建产物..."
find . -mindepth 1 ! -path './.git*' -exec rm -rf {} + 2>/dev/null || true
cp -r "$SRC/dist/." .
rm -rf dist
git add -A
git commit -q -m "deploy $(date +%Y-%m-%d_%H%M)" 2>/dev/null || echo "（无变更）"
git push -q origin gh-pages --force

echo "[4/4] 清理临时目录..."
cd / && rm -rf "$TMPD"
echo "✅ 部署完成，1-2 分钟后生效：https://bovenlawforedu.github.io/wenshucha-site/"
