#!/bin/bash
echo "🎂 Starting Happy Birthday Sekar..."
echo "190106" | sudo -S systemctl start sekar-birthday.service
sleep 1
systemctl is-active sekar-birthday.service && echo "✅ Service running: http://localhost:8000/" && echo "📱 LAN URL: http://10.10.118.205:8000/" || echo "❌ Failed"
xdg-open http://localhost:8000/ 2>/dev/null &
echo "📸 QR: assets/qr-share.jpg"
