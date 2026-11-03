git add .
git commit -m "feat: enhance language detection with detailed ratio analysis, add one-touch mic speech language switcher, and live detection pills"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub translation 업데이트 푸시 완료!"
