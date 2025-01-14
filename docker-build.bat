@echo off

setlocal enableextensions enabledelayedexpansion

set APPNAME=hackathon-demo
set BUILDCONTAINER=registry.invalid/%APPNAME%_build

set "denv="
for /f "usebackq delims=" %%a in ("environment") do (
    set "denv=!denv!-e %%a=!%%a! "
)

echo Building new docker image ...
docker build -t %BUILDCONTAINER% ./buildcontainer > ./buildcontainer/build.log && (
    echo done
) || (
    echo error building image
    exit /b 1
)

setlocal disabledelayedexpansion

if "%1"=="it" (
    docker run -it --rm %denv% --mount type=bind,src=%cd%,dst=/build --mount type=volume,src=%APPNAME%_gopkg,dst=/go/pkg --entrypoint /bin/bash %BUILDCONTAINER%
) else (
    docker run --rm %denv% --mount type=bind,src=%cd%,dst=/build --mount type=volume,src=%APPNAME%_gopkg,dst=/go/pkg %BUILDCONTAINER% %*
)