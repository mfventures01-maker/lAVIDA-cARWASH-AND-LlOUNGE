# Read-only Apps Script connectivity probe for LaVida
$ErrorActionPreference = 'Stop'
$endpoint = 'https://script.google.com/macros/s/AKfycbyzgGSIW8Bs5cQkwUXEuAl8uRSBbpfbK0U_gmUlStruNnu6D1S9djrpT7PyKgEwAnvW/exec'
$uri = "$endpoint?action=config"

Write-Host '=== LaVida Apps Script read-only probe ===' -ForegroundColor Cyan
Write-Host 'Action: GET config only. No order submission or sheet write.'
try {
  $response = Invoke-WebRequest -Uri $uri -Method Get -MaximumRedirection 8 -TimeoutSec 20
  $contentType = [string]$response.Headers['Content-Type']
  Write-Host "HTTP status: $([int]$response.StatusCode)"
  Write-Host "Content-Type: $contentType"
  Write-Host "Final URI host: $(([uri]$response.BaseResponse.ResponseUri).Host)"
  if ($contentType -match 'application/json') {
    try {
      $payload = $response.Content | ConvertFrom-Json
      Write-Host 'JSON response received.'
      if ($null -ne $payload.ok) { Write-Host "ok: $($payload.ok)" }
      if ($null -ne $payload.error) { Write-Host "error: $($payload.error)" }
      if ($null -ne $payload.data -and $null -ne $payload.data.venue_name) {
        Write-Host "venue_name: $($payload.data.venue_name)"
      }
      Write-Host 'Inspect the response schema before declaring the integration certified.'
    } catch {
      Write-Warning 'Content-Type says JSON but parsing failed.'
      exit 2
    }
  } elseif ($response.Content -match 'accounts.google.com|ServiceLogin|signin') {
    Write-Warning 'Apps Script returned an HTML sign-in page. The Web App authorization/deployment needs review.'
    exit 3
  } else {
    Write-Warning 'Response is not JSON. Do not treat it as a successful API connection.'
    Write-Host ($response.Content.Substring(0, [Math]::Min(300, $response.Content.Length)))
    exit 4
  }
} catch {
  Write-Warning "GET config failed: $($_.Exception.Message)"
  if ($_.Exception.Response) {
    try { Write-Host "HTTP status: $([int]$_.Exception.Response.StatusCode)" } catch {}
  }
  exit 1
}
