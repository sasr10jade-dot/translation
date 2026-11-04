git add .
git commit -m "feat: add 5 global languages (KO, EN, JA, ZH, FR) with smart character detection, native TTS/STT, and multilingual selectors"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 5개국어 다국어 시스템 푸시 완료!"
