#!/bin/bash
# dev-tunnel.sh - 启动文档项目 + SSH 内网穿透 (TCP)
set -e

DOC_PORT=7107
PID_DIR="/tmp/dev-tunnel-pids"
LOG_DIR="/tmp/dev-tunnel-logs"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

stop_all() {
    for f in "$PID_DIR"/*.pid; do
        [ -f "$f" ] || continue
        n=$(basename "$f" .pid); p=$(cat "$f")
        kill -0 "$p" 2>/dev/null && kill "$p" 2>/dev/null && info "$n 已停止"
        rm -f "$f"
    done
    exit 0
}

check_running() {
    [ -f "$PID_DIR/${1}.pid" ] && kill -0 "$(cat "$PID_DIR/${1}.pid")" 2>/dev/null && { warn "$1 已在运行"; return 0; }
    rm -f "$PID_DIR/${1}.pid"; return 1
}

start_service() {
    local name=$1; shift
    check_running "$name" && return
    info "启动 $name ..."
    "$@" > "$LOG_DIR/${name}.log" 2>&1 &
    echo $! > "$PID_DIR/${name}.pid"
    sleep 1
    kill -0 "$(cat "$PID_DIR/${name}.pid")" 2>/dev/null && info "$name 已启动" || { error "$name 启动失败"; cat "$LOG_DIR/${name}.log"; rm -f "$PID_DIR/${name}.pid"; }
}

mkdir -p "$PID_DIR" "$LOG_DIR"
[ "$1" = "stop" ] && stop_all
trap "warn 退出中...; stop_all" SIGINT SIGTERM

lsof -i :$DOC_PORT >/dev/null 2>&1 && warn "端口 $DOC_PORT 已被占用"

start_service vitepress npm run dev:tunnel -- --port $DOC_PORT

info "等待 dev server..."
for i in $(seq 1 20); do
    curl -s "http://localhost:$DOC_PORT" >/dev/null 2>&1 && { info "Dev server 就绪 ✓"; break; }
    [ $i -eq 20 ] && warn "超时，继续启动穿透..."
    sleep 1
done

command -v cloudflared >/dev/null && [ -f ~/.cloudflared/config.yml ] && start_service cloudflared cloudflared tunnel run butler-web
command -v cloudflared >/dev/null && [ -f ~/.cloudflared/config-butler-local.yml ] && start_service cloudflared-local cloudflared tunnel --config ~/.cloudflared/config-butler-local.yml run

sleep 3

echo ""
echo "🥸 PancakeUI Dev + Tunnel"
echo "📖 本地: http://localhost:$DOC_PORT"
echo "🌐 CF:   https://dev.frontend-m.online"
echo "🌐 本地: https://local.frontend-m.online"
echo "🛑 停止: ./dev-tunnel.sh stop"
echo ""

info "按 Ctrl+C 停止所有服务"
wait
