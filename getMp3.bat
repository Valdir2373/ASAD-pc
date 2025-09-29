@echo off
setlocal

:: =========================================================
:: Script BAT para converter URL do YouTube para MP3
:: Uso na CLI: getMp3.bat <URL_DO_VIDEO>
:: =========================================================

:: 1. Verifica se a URL foi fornecida
if "%~1" == "" (
    echo.ERRO: Forneca a URL do YouTube como argumento.
    echo.Uso: %~n0 "https://..."
    exit /b 1
)

:: 2. Armazena a URL. %~1 remove aspas, se houver.
set "videoUrl=%~1"

echo.Fazendo requisicao POST para https://www.youtubemp3.ltd/convert ...

:: 3. Executa o PowerShell em UMA ÚNICA LINHA para evitar o erro de parser em ambientes diferentes.
::    Usamos o ';' para separar os comandos internos do PowerShell.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$videoUrl = '%videoUrl%'; $encodedUrl = [uri]::EscapeDataString($videoUrl); $bodyString = 'url=' + $encodedUrl; $uri = 'https://www.youtubemp3.ltd/convert'; try { $response = Invoke-RestMethod -Uri $uri -Method Post -Body $bodyString -ContentType 'application/x-www-form-urlencoded'; Write-Host ''; Write-Host 'Link para o MP3 (response.link):'; Write-Host $response.link; } catch { Write-Host 'ERRO: Nao foi possivel completar a requisicao ou processar a resposta.'; Write-Host 'Verifique a URL e a disponibilidade do servico.'; exit 1; }"

endlocal
exit /b 0