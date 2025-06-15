-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "description" TEXT,
ADD COLUMN     "servicePlans" JSONB,
ADD COLUMN     "specialties" TEXT[];
