Write-Host "============================================================="
Write-Host "GitInspector"
Write-Host "* Inspection will be made on the currently checked out branch"
Write-Host "* Results get written to gitinspector.html"
Write-Host "============================================================="
Write-Host 
Write-Host "Running GitInspector..."

# gitinspector command
docker run --rm -v ${PWD}:/repo `
felix/gitinspector:0.4.4 --format=html --grading -L `
--file-types=java,cs,c,cc,cpp,h,hh,hpp,glsl,php,py,pl,scala,rb,js,jsx,cjs,svelte,ts,tsx,vue,jade,proto,ml,mli,hs,po,pot,sql,gql,html,htm,cshtml,css,scss,sass,xml,jsp,jspx,doc,docx,xls,xlsx,txt,md,tex,drawio,bib,*,marker,yml,cmd,bat,sh,ps1,sln,csproj,dcproj,runsettings,conf,webmanifest,iml,yaml,toml,template `
-x file:package-lock.json -x "file:.cls$" `
-x file:assets -x file:node_modules `
-x file:template_ieee.tex `
> "gitinspector.html"

Write-Host "Finsihed running GitInspector..."