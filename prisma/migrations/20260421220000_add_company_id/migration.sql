-- Add companyId to Company table
-- Existing rows get a placeholder; real value set on first Settings save
ALTER TABLE "Company" ADD COLUMN "companyId" TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE "Company" ADD CONSTRAINT "Company_companyId_key" UNIQUE ("companyId");
-- Add Stripe fields
ALTER TABLE "Company" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "Company" ADD COLUMN "stripePlanId" TEXT;
ALTER TABLE "Company" ADD COLUMN "subscriptionStatus" TEXT;

-- Add companyId to Customer table (existing rows get 'legacy')
ALTER TABLE "Customer" ADD COLUMN "companyId" TEXT NOT NULL DEFAULT 'legacy';
CREATE INDEX "Customer_companyId_idx" ON "Customer"("companyId");

-- Add companyId to Inspection table (existing rows get 'legacy')
ALTER TABLE "Inspection" ADD COLUMN "companyId" TEXT NOT NULL DEFAULT 'legacy';
CREATE INDEX "Inspection_companyId_idx" ON "Inspection"("companyId");

-- Remove the defaults now that existing rows are backfilled
ALTER TABLE "Company" ALTER COLUMN "companyId" DROP DEFAULT;
ALTER TABLE "Customer" ALTER COLUMN "companyId" DROP DEFAULT;
ALTER TABLE "Inspection" ALTER COLUMN "companyId" DROP DEFAULT;
