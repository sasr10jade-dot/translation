git add .
git commit -m "feat: complete next-gen meeting intelligence - speaker separation (me vs partner), cultural nuance coach tooltips, and Slack webhook integration"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 차세대 고도화 기능 푸시 완료!"
