# ================================================================
#  Ode AI Skills — One-Click Installer for Windows
#  Right-click this file → "Run with PowerShell"
#  يثبّت المهارات تلقائياً في D:\claude-skills
# ================================================================

$Owner    = "Ode-sys"
$Repo     = "Usa-Products"
$Target   = "D:\claude-skills"
$ApiUrl   = "https://api.github.com/repos/$Owner/$Repo/releases/latest"

Write-Host ""
Write-Host "  ╔═══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║      Ode AI Skills Installer          ║" -ForegroundColor Cyan
Write-Host "  ╚═══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── جرّب التحميل من GitHub Releases أولاً ────────────────────
$ZipPath   = "$env:TEMP\ode-ai-skills.zip"
$UseGitHub = $false

try {
    Write-Host "  جاري البحث عن آخر إصدار على GitHub..." -ForegroundColor Gray
    $Headers = @{ Accept = "application/vnd.github.v3+json"; "User-Agent" = "OdeInstaller" }
    $Release = Invoke-RestMethod -Uri $ApiUrl -Headers $Headers -ErrorAction Stop
    $Asset   = $Release.assets | Where-Object { $_.name -like "ode-ai-skills*.zip" } | Select-Object -First 1

    if ($Asset) {
        Write-Host "  تم إيجاد الإصدار: $($Release.name)" -ForegroundColor Cyan
        Write-Host "  جاري التحميل ($([math]::Round($Asset.size/1MB,1)) MB)..." -ForegroundColor Gray
        Invoke-WebRequest -Uri $Asset.browser_download_url -OutFile $ZipPath -UseBasicParsing
        $UseGitHub = $true
    }
} catch {
    Write-Host "  لا يوجد إصدار جاهز بعد — سيتم الكلون من Git." -ForegroundColor Yellow
}

# ── إذا فشل التحميل — استخدم git clone مع sparse checkout ───
if (-not $UseGitHub) {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Host "  Git غير مثبّت." -ForegroundColor Red
        Write-Host "  حمّله من: https://git-scm.com/download/win" -ForegroundColor Yellow
        Read-Host "`n  اضغط Enter للخروج"
        exit 1
    }

    $Branch   = "main"
    $RepoUrl  = "https://github.com/$Owner/$Repo.git"
    $TempDir  = "$env:TEMP\ode-clone-$(Get-Random)"

    Write-Host "  جاري الكلون (sparse)..." -ForegroundColor Cyan
    git clone --filter=blob:none --sparse --branch $Branch --depth 1 $RepoUrl $TempDir 2>&1 | Out-Null

    if ($LASTEXITCODE -ne 0) {
        Write-Host "  فشل الكلون. تحقق من الاتصال أو أن الريبو متاح." -ForegroundColor Red
        Read-Host "`n  اضغط Enter للخروج"
        exit 1
    }

    Push-Location $TempDir
    git sparse-checkout set .claude/skills 2>&1 | Out-Null
    Pop-Location

    $SkillsSrc = "$TempDir\.claude\skills"
    $SkillsDst = "$Target\.claude"
    New-Item -ItemType Directory -Force -Path $SkillsDst | Out-Null
    Copy-Item -Recurse -Force "$TempDir\.claude\skills" "$SkillsDst\"
    Remove-Item -Recurse -Force $TempDir

    $Count = (Get-ChildItem -Path "$Target\.claude\skills" -Filter "SKILL.md" -Recurse).Count
    Write-Host ""
    Write-Host "  ════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  OK  $Count مهارة مثبّتة" -ForegroundColor Green
    Write-Host "  المسار: $Target\.claude\skills" -ForegroundColor White
    Write-Host "  ════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Read-Host "  افتح VS Code: code $Target`n  اضغط Enter للخروج"
    exit 0
}

# ── فكّ ZIP في D:\claude-skills ──────────────────────────────
Write-Host "  جاري الفك في $Target ..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $Target | Out-Null
Expand-Archive -Path $ZipPath -DestinationPath $Target -Force
Remove-Item $ZipPath -Force

$Count = (Get-ChildItem -Path "$Target\.claude\skills" -Filter "SKILL.md" -Recurse -ErrorAction SilentlyContinue).Count

Write-Host ""
Write-Host "  ════════════════════════════════════════" -ForegroundColor Green
Write-Host "  OK  $Count مهارة مثبّتة" -ForegroundColor Green
Write-Host "  المسار: $Target\.claude\skills\" -ForegroundColor White
Write-Host "  ════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  الخطوة التالية: افتح VS Code" -ForegroundColor Cyan
Write-Host "  code $Target" -ForegroundColor Gray
Write-Host ""
Read-Host "  اضغط Enter للخروج"
