/*
  Warnings:

  - You are about to drop the column `createdAt` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `approval_logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `approval_logs` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `approval_logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `newData` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `oldData` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `recordId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `tableName` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `batchCode` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `isExhausted` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `maintenanceDueDate` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `manufactureDate` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `receivedAt` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `remainingQty` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `minThreshold` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `login_histories` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `login_histories` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `login_histories` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `login_histories` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `request_items` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `request_items` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `fromUnitId` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `isEmergency` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `toUnitId` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `baseId` on the `stock_items` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `stock_items` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `stock_items` table. All the data in the column will be lost.
  - You are about to drop the column `reservedQty` on the `stock_items` table. All the data in the column will be lost.
  - You are about to drop the column `baseId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `batchId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transferId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `transfers` table. All the data in the column will be lost.
  - You are about to drop the column `fromUnitId` on the `transfers` table. All the data in the column will be lost.
  - You are about to drop the column `initiatedBy` on the `transfers` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `transfers` table. All the data in the column will be lost.
  - You are about to drop the column `toUnitId` on the `transfers` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `units` table. All the data in the column will be lost.
  - You are about to drop the column `commandLevel` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `failedAttempts` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lockedUntil` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[batch_code]` on the table `batches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[base_id,item_id]` on the table `stock_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `units` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unit_id` to the `alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `approved_by` to the `approval_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_id` to the `approval_logs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `action` on the `approval_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `record_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `table_name` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batch_code` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remaining_qty` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min_threshold` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `login_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `request_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_id` to the `request_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_unit_id` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_unit_id` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base_id` to the `stock_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `stock_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base_id` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_unit_id` to the `transfers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initiated_by` to the `transfers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `transfers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_unit_id` to the `transfers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `command_level` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_unitId_fkey";

-- DropForeignKey
ALTER TABLE "approval_logs" DROP CONSTRAINT "approval_logs_approvedBy_fkey";

-- DropForeignKey
ALTER TABLE "approval_logs" DROP CONSTRAINT "approval_logs_requestId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_itemId_fkey";

-- DropForeignKey
ALTER TABLE "login_histories" DROP CONSTRAINT "login_histories_userId_fkey";

-- DropForeignKey
ALTER TABLE "request_items" DROP CONSTRAINT "request_items_itemId_fkey";

-- DropForeignKey
ALTER TABLE "request_items" DROP CONSTRAINT "request_items_requestId_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_createdById_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_fromUnitId_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_toUnitId_fkey";

-- DropForeignKey
ALTER TABLE "stock_items" DROP CONSTRAINT "stock_items_baseId_fkey";

-- DropForeignKey
ALTER TABLE "stock_items" DROP CONSTRAINT "stock_items_itemId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_batchId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_transferId_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_fromUnitId_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_initiatedBy_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_toUnitId_fkey";

-- DropForeignKey
ALTER TABLE "units" DROP CONSTRAINT "units_parentId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_unitId_fkey";

-- DropIndex
DROP INDEX "alerts_unitId_isRead_idx";

-- DropIndex
DROP INDEX "audit_logs_tableName_recordId_idx";

-- DropIndex
DROP INDEX "audit_logs_userId_createdAt_idx";

-- DropIndex
DROP INDEX "batches_batchCode_key";

-- DropIndex
DROP INDEX "batches_itemId_expiryDate_idx";

-- DropIndex
DROP INDEX "login_histories_userId_idx";

-- DropIndex
DROP INDEX "requests_status_fromUnitId_idx";

-- DropIndex
DROP INDEX "stock_items_baseId_itemId_idx";

-- DropIndex
DROP INDEX "stock_items_baseId_itemId_key";

-- DropIndex
DROP INDEX "transactions_baseId_createdAt_idx";

-- AlterTable
ALTER TABLE "alerts" DROP COLUMN "createdAt",
DROP COLUMN "isRead",
DROP COLUMN "itemId",
DROP COLUMN "unitId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "item_id" TEXT,
ADD COLUMN     "unit_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "approval_logs" DROP COLUMN "approvedBy",
DROP COLUMN "createdAt",
DROP COLUMN "requestId",
ADD COLUMN     "approved_by" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "request_id" TEXT NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "createdAt",
DROP COLUMN "ipAddress",
DROP COLUMN "newData",
DROP COLUMN "oldData",
DROP COLUMN "recordId",
DROP COLUMN "tableName",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "new_data" JSONB,
ADD COLUMN     "old_data" JSONB,
ADD COLUMN     "record_id" TEXT NOT NULL,
ADD COLUMN     "table_name" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "batches" DROP COLUMN "batchCode",
DROP COLUMN "expiryDate",
DROP COLUMN "isExhausted",
DROP COLUMN "itemId",
DROP COLUMN "maintenanceDueDate",
DROP COLUMN "manufactureDate",
DROP COLUMN "receivedAt",
DROP COLUMN "remainingQty",
ADD COLUMN     "batch_code" TEXT NOT NULL,
ADD COLUMN     "expiry_date" TIMESTAMP(3),
ADD COLUMN     "is_exhausted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "item_id" TEXT NOT NULL,
ADD COLUMN     "maintenance_due_date" TIMESTAMP(3),
ADD COLUMN     "manufacture_date" TIMESTAMP(3),
ADD COLUMN     "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "remaining_qty" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "minThreshold",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "min_threshold" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "login_histories" DROP COLUMN "createdAt",
DROP COLUMN "ipAddress",
DROP COLUMN "userAgent",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "user_agent" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "request_items" DROP COLUMN "itemId",
DROP COLUMN "requestId",
ADD COLUMN     "item_id" TEXT NOT NULL,
ADD COLUMN     "request_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "createdAt",
DROP COLUMN "createdById",
DROP COLUMN "fromUnitId",
DROP COLUMN "isEmergency",
DROP COLUMN "toUnitId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "from_unit_id" TEXT NOT NULL,
ADD COLUMN     "is_emergency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "to_unit_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "stock_items" DROP COLUMN "baseId",
DROP COLUMN "itemId",
DROP COLUMN "lastUpdated",
DROP COLUMN "reservedQty",
ADD COLUMN     "base_id" TEXT NOT NULL,
ADD COLUMN     "item_id" TEXT NOT NULL,
ADD COLUMN     "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reserved_qty" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "baseId",
DROP COLUMN "batchId",
DROP COLUMN "createdAt",
DROP COLUMN "transferId",
ADD COLUMN     "base_id" TEXT NOT NULL,
ADD COLUMN     "batch_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "transfer_id" TEXT;

-- AlterTable
ALTER TABLE "transfers" DROP COLUMN "createdAt",
DROP COLUMN "fromUnitId",
DROP COLUMN "initiatedBy",
DROP COLUMN "itemId",
DROP COLUMN "toUnitId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "from_unit_id" TEXT NOT NULL,
ADD COLUMN     "initiated_by" TEXT NOT NULL,
ADD COLUMN     "item_id" TEXT NOT NULL,
ADD COLUMN     "to_unit_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "units" DROP COLUMN "parentId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parent_id" TEXT,
ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "commandLevel",
DROP COLUMN "createdAt",
DROP COLUMN "failedAttempts",
DROP COLUMN "isActive",
DROP COLUMN "lockedUntil",
DROP COLUMN "passwordHash",
DROP COLUMN "unitId",
DROP COLUMN "updatedAt",
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "command_level" "CommandLevel" NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "failed_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "locked_until" TIMESTAMP(3),
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "unit_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "alerts_unit_id_is_read_idx" ON "alerts"("unit_id", "is_read");

-- CreateIndex
CREATE INDEX "audit_logs_table_name_record_id_idx" ON "audit_logs"("table_name", "record_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "batches_batch_code_key" ON "batches"("batch_code");

-- CreateIndex
CREATE INDEX "batches_item_id_expiry_date_idx" ON "batches"("item_id", "expiry_date");

-- CreateIndex
CREATE INDEX "login_histories_user_id_idx" ON "login_histories"("user_id");

-- CreateIndex
CREATE INDEX "requests_status_from_unit_id_idx" ON "requests"("status", "from_unit_id");

-- CreateIndex
CREATE INDEX "stock_items_base_id_item_id_idx" ON "stock_items"("base_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "stock_items_base_id_item_id_key" ON "stock_items"("base_id", "item_id");

-- CreateIndex
CREATE INDEX "transactions_base_id_created_at_idx" ON "transactions"("base_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_histories" ADD CONSTRAINT "login_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_from_unit_id_fkey" FOREIGN KEY ("from_unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_to_unit_id_fkey" FOREIGN KEY ("to_unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_items" ADD CONSTRAINT "request_items_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_items" ADD CONSTRAINT "request_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_logs" ADD CONSTRAINT "approval_logs_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_logs" ADD CONSTRAINT "approval_logs_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_unit_id_fkey" FOREIGN KEY ("from_unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_unit_id_fkey" FOREIGN KEY ("to_unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_initiated_by_fkey" FOREIGN KEY ("initiated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "transfers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
