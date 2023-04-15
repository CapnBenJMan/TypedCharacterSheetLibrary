@echo off

:: Step 1: Copy proto-scripts to temp dir

echo ProtoHTML Scripts
echo:

mkdir __TEMP

call ts-node copyer.ts

:: Step 2: From temp dir, transpile ts to Scripts/JS/

call tsc -p scriptsTSC.json >nul

:: Step 3: Delete temp dir

rd /S /Q __TEMP
echo:

:: Step 4: Transpile PostCSS to CSS

echo ProtoHTML Styles
echo:

call ts-node processPostCSS.ts

echo:

:: Step 5: Run Prettier on processed CSS

call npx prettier --config ./.prettierrc.json -w "../ProtoHTML/Styles/CSS/*.css"

echo:

:: Step 6: Collect all components into a signle HTML file in Typed/HTML/

echo Collecting...
echo:

call ts-node collector.ts
echo:

:: Step 7: Run Prettier on final files

echo Finalizing...
echo:

call npx prettier --config ./.prettierrc.json -w "../../HTML/*.html"