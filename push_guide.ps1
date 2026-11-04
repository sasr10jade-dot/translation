git add .
git commit -m "feat: add comprehensive User Guide modal to header with 4 categorized tabs covering all features"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 사용자 가이드 푸시 완료!"
