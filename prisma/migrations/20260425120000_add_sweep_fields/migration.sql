-- Add sweep-only field notes and photo documentation URL
ALTER TABLE "Inspection" ADD COLUMN IF NOT EXISTS "internalNotes" TEXT;
ALTER TABLE "Inspection" ADD COLUMN IF NOT EXISTS "roofAccess" TEXT;
ALTER TABLE "Inspection" ADD COLUMN IF NOT EXISTS "fireplaceOpeningWidth" TEXT;
ALTER TABLE "Inspection" ADD COLUMN IF NOT EXISTS "fireplaceOpeningHeight" TEXT;
ALTER TABLE "Inspection" ADD COLUMN IF NOT EXISTS "companyCamUrl" TEXT;
