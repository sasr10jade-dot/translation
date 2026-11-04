git add .
git commit -m "style: overhaul layout tone and manner with unified obsidian dark, crisp snow light, and executive minimal toolbar"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 톤앤매너 리파인 푸시 완료!"
