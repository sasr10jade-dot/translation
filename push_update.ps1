git add .
git commit -m "feat: complete mobile responsive layout, fix PWA manifest relative paths & PNG icons, always-visible install button, and free Gemini API key link"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 모바일 및 PWA 업데이트 푸시 완료!"
