-- AlterTable
ALTER TABLE "Indexer" ADD COLUMN     "subscriptionAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "subscriptionType" TEXT NOT NULL DEFAULT '';
