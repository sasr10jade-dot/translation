git add .
git commit -m "feat: switch repo to translation, add infinite mic continuous loop, Noto Sans KR font with custom scale adjuster, and advanced language detection"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub translation 저장소 동기화 완료!"
