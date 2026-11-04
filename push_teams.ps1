git add .
git commit -m "feat: complete Microsoft Teams integration with Office 365 Connector webhook and specialized Teams audio capture guide"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub Teams 연동 푸시 완료!"
