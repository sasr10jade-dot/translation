git add .
git commit -m "fix: resolve mobile STT microphone conflict, optimize SpeechRecognition for mobile browser lifecycle"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 모바일 실시간 번역 패치 푸시 완료!"
