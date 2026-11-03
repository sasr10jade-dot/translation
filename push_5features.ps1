git add .
git commit -m "feat: complete all 5 pro meeting features - push-to-talk, meeting stream timeline, AI 3-bullet summary with to-do extraction, Chrome PIP subtitle, and custom glossary system"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 5대 기능 전체 푸시 완료!"
