@echo off
setlocal
set "source=%~dp0dist\CRM Sistema.lnk"
set "desktop=%USERPROFILE%\Desktop"
if not exist "%source%" (
    echo Arquivo de atalho nao encontrado em %source%
    pause
    exit /b 1
)
copy /Y "%source%" "%desktop%\" >nul
if errorlevel 1 (
    echo Falha ao copiar o atalho.
    pause
    exit /b 1
)
echo Atalho copiado para a Area de Trabalho.
pause
