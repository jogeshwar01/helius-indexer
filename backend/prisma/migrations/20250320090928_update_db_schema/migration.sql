/*
  Warnings:

  - You are about to drop the column `dbname` on the `DatabaseCreds` table. All the data in the column will be lost.
  - You are about to drop the column `host` on the `DatabaseCreds` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `DatabaseCreds` table. All the data in the column will be lost.
  - You are about to drop the column `port` on the `DatabaseCreds` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `DatabaseCreds` table. All the data in the column will be lost.
  - Added the required column `dbUrl` to the `DatabaseCreds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DatabaseCreds" DROP COLUMN "dbname",
DROP COLUMN "host",
DROP COLUMN "password",
DROP COLUMN "port",
DROP COLUMN "username",
ADD COLUMN     "dbUrl" TEXT NOT NULL;
