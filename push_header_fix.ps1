git add .
git commit -m "fix: resolve mobile header overflow with clean 2-row layout - row1 brand & icon actions, row2 full-width 5-language dropdowns"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 모바일 헤더 정렬 푸시 완료!"
