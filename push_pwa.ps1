git add .
git commit -m "feat: add PWA Install Modal with 1-click desktop shortcut (.url) download and native app install prompt"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub PWA 모달 업데이트 푸시 완료!"
