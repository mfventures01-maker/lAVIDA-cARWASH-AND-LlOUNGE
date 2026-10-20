# PowerShell setup script for LaVida CARSS
$ErrorActionPreference = 'Stop'
$repoUrl = 'https://github.com/mfventures01-maker/lAVIDA-cARWASH-AND-LlOUNGE.git'
$projectsRoot = 'C:\Projects'
$repoName = 'lAVIDA-cARWASH-AND-LlOUNGE'
$target = Join-Path $projectsRoot $repoName

Write-Host '=== LaVida local setup: read-first ===' -ForegroundColor Cyan
Write-Host "Target: $target"

if (-not (Test-Path $projectsRoot)) {
  New-Item -ItemType Directory -Path $projectsRoot | Out-Null
}

if (Test-Path $target) {
  if (-not (Test-Path (Join-Path $target '.git'))) {
    throw "Target exists but is not a Git repository. No files were overwritten: $target"
  }
  Push-Location $target
  try {
    Write-Host 'Existing Git repository found. Read-only evidence:'
    git remote -v
    git status --short
    git branch --show-current
    git rev-parse HEAD
    Write-Host 'No pull/reset/overwrite performed.'
  } finally {
    Pop-Location
  }
} else {
  git clone $repoUrl $target
  if ($LASTEXITCODE -ne 0) { throw 'git clone failed.' }
  Push-Location $target
  try {
    Write-Host 'Clone verification:'
    git remote -v
    git status --short
    git branch --show-current
    git rev-parse HEAD
  } finally {
    Pop-Location
  }
}

Write-Host ''
Write-Host 'Next: inspect .env presence and Apps Script BFF behavior. No Apps Script writes or deployment performed.' -ForegroundColor Yellow
