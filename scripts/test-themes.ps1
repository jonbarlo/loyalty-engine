# PowerShell script to run only theme-related tests
Write-Host "Running theme-related tests..." -ForegroundColor Green

# Run only theme tests
npm test -- --testPathPattern="ThemeController|themeService" --verbose

Write-Host "Theme tests completed!" -ForegroundColor Green 