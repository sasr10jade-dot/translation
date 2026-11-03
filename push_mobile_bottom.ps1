git add .
git commit -m "feat: enhance light theme contrast with deep black typography, and add mobile bottom floating mic action bar"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 모바일 하단바 및 라이트모드 가독성 푸시 완료!"
