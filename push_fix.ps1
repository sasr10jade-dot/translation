git add .
git commit -m "fix: resolve stale closure in speech recognition lifecycle, fix URI 414 error with chunking, add HTML entity decoding, and HiDPI canvas visualizer"

$token = (gh auth token).Trim()
git remote set-url origin "https://sasr10jade-dot:$token@github.com/sasr10jade-dot/translation.git"
git push origin main
git remote set-url origin "https://github.com/sasr10jade-dot/translation.git"
Write-Host "GitHub 버그 패치 푸시 완료!"
