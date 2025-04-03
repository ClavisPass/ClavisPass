@echo off
:: Set the path to Git Bash
set GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"

:: Execute Git Bash to run the release script, passing the version as an argument
%GIT_BASH_PATH% ./release.sh %1