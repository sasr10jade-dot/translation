git add .
git commit -m "docs: fully update UserGuideModal with 5 languages, speaker separation, cultural nuance coach, and Teams/Slack integrations"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 사용자 가이드 현행화 푸시 완료!"
