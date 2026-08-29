# Perla Marine web-site - dead file cleanup
# Repo kok dizininde (web site klasorunun icinde) calistirin.

$paths = @(
  "server",
  "drizzle",
  "shared",
  "drizzle.config.ts",
  "audit-artifacts",
  "RAKIP_SITE_BULGULARI.md",
  "REDESIGN_VERIFICATION.md",
  "SQUARESPACE_AKTARIM_REHBERI.md",
  "SQUARESPACE_KURULUM_PLANI.md",
  "audit-references.md",
  "current-priority-audit.md",
  "homepage-analysis-notes.md",
  "homepage-analysis-report.md",
  "ideas.md",
  "site-audit-findings.md",
  "technical-architecture-audit.md",
  "template.json",
  "todo.md",
  "usage-audit-notes.md",
  "verification-notes.md",
  "contrast_check.py",
  "keyboard-check.mjs",
  "scripts\crop_service_system_images.py",
  "scripts\verify-corporate-pages.mjs",
  "scripts\verify-header.mjs",
  "scripts\verify-interactions.mjs",
  "scripts\verify-new-flows.mjs",
  "scripts\verify-project-gallery.mjs",
  "client\src\pages\ComponentShowcase.tsx",
  "client\src\components\AIChatBox.tsx",
  "client\src\hooks\useAuth.ts",
  "client\src\pages\Contact.tsx",
  "client\src\const.ts",
  "client\src\lib\trpc.ts",
  "client\src\dev",
  "client\src\components\ServiceGrid.test.ts",
  "client\src\pages\CorporatePages.test.ts",
  "client\src\pages\ProjectDraftPreview.test.ts",
  "client\src\pages\Contact.validation.test.ts",
  "client\src\pages\AdminContent.test.ts",
  "client\src\pages\Home.test.ts"
)

foreach ($p in $paths) {
  if (Test-Path $p) {
    Remove-Item -Recurse -Force $p
    Write-Host "Removed: $p"
  } else {
    Write-Host "Not found (skip): $p"
  }
}

Write-Host ""
Write-Host "Cleanup done. Now copy the files from cleanup-updated-files.zip into place, then run: pnpm install"
