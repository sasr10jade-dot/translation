git add .
git commit -m "feat: complete mobile responsive overhaul - ultra slim mobile header, full-width touch mic controls, and horizontal swipe quick chips"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 모바일 최적화 푸시 완료!"
