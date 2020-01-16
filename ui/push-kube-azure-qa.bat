git checkout cm-qa
git pull
XCOPY ".\base-url.model-kube-azure-qa.ts" ".\src\app\models\url\base-url.model.ts" /Y

call npm run build-prod

echo ProjectCMUI-QA Build : %date% %time% > .\cmui/build.html
type base-url.model-kube-azure-qa.ts >> .\cmui/build.html

XCOPY ".\base-url.model-local.ts" ".\src\app\models\url\base-url.model.ts" /Y

pause
