git add .
git commit -m "feat: add light/dark mode theme toggle with persistent storage"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub translation 테마 기능 푸시 완료!"
