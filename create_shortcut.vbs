Set WshShell = WScript.CreateObject("WScript.Shell")
Set oShellLink = WshShell.CreateShortcut(WshShell.ExpandEnvironmentStrings("%USERPROFILE%\Desktop\CRM Sistema.lnk"))
oShellLink.TargetPath = WshShell.ExpandEnvironmentStrings("C:\Users\User\Desktop\crm-comunidade-terapêutica (1)\dist\start_system.bat")
oShellLink.WorkingDirectory = WshShell.ExpandEnvironmentStrings("C:\Users\User\Desktop\crm-comunidade-terapêutica (1)\dist")
oShellLink.IconLocation = WshShell.ExpandEnvironmentStrings("C:\Windows\System32\SHELL32.dll,44")
oShellLink.Description = "Abrir CRM da Comunidade Terapêutica"
oShellLink.WindowStyle = 7
oShellLink.Save
