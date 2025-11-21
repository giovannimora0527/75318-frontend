# Script de pruebas: recuperación de contraseña y bloqueo por intentos
# Requiere: PowerShell y backend ejecutándose en http://localhost:8000

$base = 'http://localhost:8000'

function PostJson($uri, $body) {
  try {
    return Invoke-RestMethod -Method Post -Uri $uri -Body ($body | ConvertTo-Json) -ContentType 'application/json'
  } catch {
    Write-Host "Request to $uri failed: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.Exception.Response) {
      try { $code = $_.Exception.Response.StatusCode.value__ } catch { $code = 'unknown' }
      Write-Host "HTTP status: $code"
    }
    return $null
  }
}

Write-Host "=== Prueba 1: Recuperación con usuario inválido ==="
$r = PostJson "$base/auth/password-recovery" @{ username = 'noexiste' }
Write-Host "Respuesta: "
Write-Host ($r | ConvertTo-Json -Depth 3)

Write-Host "\n=== Prueba 2: Recuperación con usuario válido (jdoe) ==="
$r = PostJson "$base/auth/password-recovery" @{ username = 'jdoe' }
Write-Host "Respuesta: "
Write-Host ($r | ConvertTo-Json -Depth 3)
Write-Host "(Revisar consola del servidor para el token simulado)"

Write-Host "\n=== Prueba 3: Intentos de login con contraseña errónea (4 intentos) ==="
for ($i=1; $i -le 4; $i++) {
  Write-Host "Intento $i:"
  $resp = PostJson "$base/auth/login" @{ username = 'jdoe'; password = 'badpassword' }
  if ($resp) { Write-Host "Respuesta: $($resp | ConvertTo-Json -Depth 2)" } else { Write-Host "No se obtuvo respuesta exitosa." }
  Start-Sleep -Seconds 1
}

Write-Host "\n=== Prueba 4: Intento de login después del bloqueo (usar contraseña correcta) ==="
$resp = PostJson "$base/auth/login" @{ username = 'jdoe'; password = 'Password123' }
Write-Host "Respuesta: "
Write-Host ($resp | ConvertTo-Json -Depth 2)

Write-Host "\n=== Consultar logs de auditoría para 'jdoe' ==="
try {
  $logs = Invoke-RestMethod -Method Get -Uri "$base/audit/logs?page=0&size=50&username=jdoe"
  Write-Host ($logs | ConvertTo-Json -Depth 5)
} catch {
  Write-Host "No se pudo recuperar logs: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "\nPruebas completadas."
