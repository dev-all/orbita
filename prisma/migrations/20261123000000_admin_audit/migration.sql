CREATE TABLE "AdminAudit" (
  "id" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "before" JSONB NOT NULL,
  "after" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminAudit_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AdminAudit_productId_createdAt_idx" ON "AdminAudit"("productId", "createdAt");
