#!/bin/bash
set -e

DOC_PORT=7107
NATAPP_BIN=/opt/natapp/natapp
NATAPP_TOKEN=4da69c179f19165f
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

[ -x "$NATAPP_BIN" ] && start_service natapp "$NATAPP_BIN" -authtoken="$NATAPP_TOKEN"
command -v cloudflared >/dev/null && [ -f ~/.cloudflared/config.yml ] && start_service cloudflared cloudflared tunnel run butler-web

sleep 3
echo ""
echo "🥸 PancakeUI Dev + Tunnel"
echo "📖 本地:  http://localhost:$DOC_PORT"
echo "🌐 CF:    https://dev.frontend-m.online"
[ -f "$LOG_DIR/natapp.log" ] && echo "🌐 NATAPP: $(grep -o 'http://[^\ ]*' "$LOG_DIR/natapp.log" | tail -1)"
echo "🛑 停止:  ./dev-tunnel.sh stop"
echo ""

info "按 Ctrl+C 停止所有服务"
wait
cd ~/projects/Saltedfish-Website

cat > dev-tunnel.sh << 'SCRIPT'
#!/bin/bash
# dev-tunnel.sh - 一键启动文档项目 + 内网穿透
set -e

DOC_PORT=7107
NATAPP_BIN=/opt/natapp/natapp
NATAPP_TOKEN=4da69c179f19165f
PID_DIR="/tmp/dev-tunnel-pids"
LOG_DIR="/tmp/dev-tunnel-logs"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

stop_all() {
    info "正在停止所有服务..."
    for pid_file in "$PID_DIR"/*.pid; do
        [ -f "$pid_file" ] || continue
        name=$(basename "$pid_file" .pid)
        pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null && info "$name (PID: $pid) 已停止"
        else
            warn "$name (PID: $pid) 已不在运行"
        fi
        rm -f "$pid_file"
    done
    exit 0
}

check_running() {
    local pid_file="$PID_DIR/${1}.pid"
    [ -f "$pid_file" ] && kill -0 "$(cat "$pid_file")" 2>/dev/null && { warn "$1 已在运行"; return 0; }
    rm -f "$pid_file"
    return 1
}

start_service() {
    local name=$1; shift
    check_running "$name" && return
    info "启动 $name ..."
    "$@" > "$LOG_DIR/${name}.log" 2>&1 &
    echo $! > "$PID_DIR/${name}.pid"
    sleep 1
    kill -0 "$(cat "$PID_DIR/${name}.pid")" 2>/dev/null && info "$name 已启动 (PID: $(cat "$PID_DIR/${name}.pid"))" || { error "$name 启动失败"; cat "$LOG_DIR/${name}.log"; rm -f "$PID_DIR/${name}.pid"; }
}

cleanup() { warn "退出中..."; stop_all; }
mkdir -p "$PID_DIR" "$LOG_DIR"
[ "$1" = "stop" ] && stop_all
trap cleanup SIGINT SIGTERM

lsof -i :$DOC_PORT >/dev/null 2>&1 && warn "端口 $DOC_PORT 已被占用"

start_service "vitepress" npm run dev:tunnel -- --port $DOC_PORT

info "等待 dev server..."
for i in $(seq 1 20); do
    curl -s "http://localhost:$DOC_PORT" >/dev/null 2>&1 && { info "Dev server 就绪 ✓"; break; }
    [ $i -eq 20 ] && warn "超时，继续启动穿透..."
    sleep 1
done

[ -x "$NATAPP_BIN" ] && start_service "natapp" "$NATAPP_BIN" -authtoken="$NATAPP_TOKEN"
command -v cloudflared >/dev/null && [ -f ~/.cloudflared/config.yml ] && start_service "cloudflared" cloudflared tunnel run butler-web

sleep 3
echo ""
echo "🥸 PancakeUI Dev + Tunnel"
echo "📖 本地:  http://localhost:$DOC_PORT"
echo "🌐 CF:    https://dev.frontend-m.online"
[ -f "$LOG_DIR/natapp.log" ] && echo "🌐 NATAPP: $(grep '^Forwarding' "$LOG_DIR/natapp.log" | head -1 | awk '{print $2}')"
echo "📋 日志:  $LOG_DIR/"
echo "🛑 停止:  ./dev-tunnel.sh stop"
echo ""

info "按 Ctrl+C 停止所有服务"
wait
SCRIPT

chmod +x dev-tunnel.sh
./dev-tunnel.sh
