## Note

* Please install electron-updater@4.6.5 because new version seems not working.__
`npm install electron-updater@4.6.5 --save`

* If you are using Github, run the below script in powershell before you build publish:__
`[Environment]::SetEnvironmentVariable("GH_TOKEN","<your token>","User")`__
`npm run publish`
