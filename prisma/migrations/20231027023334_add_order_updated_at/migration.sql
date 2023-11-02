/*
  Warnings:

  - Added the required column `orderUpdatedAt` to the `CustomerVisit` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomerVisit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" TEXT NOT NULL,
    "orderName" TEXT NOT NULL,
    "orderNote" TEXT,
    "orderUpdatedAt" DATETIME NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerName" TEXT,
    "customerOrderIndex" INTEGER NOT NULL,
    "daysToConversion" INTEGER,
    "momentsCount" INTEGER NOT NULL,
    "firstVisitLandingPage" TEXT,
    "firstVisitOccuredAt" DATETIME,
    "firstVisitReferralCode" TEXT,
    "firstVisitReferralInfoHtml" TEXT,
    "firstVisitReferrerUrl" TEXT,
    "firstVisitSource" TEXT,
    "firstVisitSourceDescription" TEXT,
    "firstVisitSourceType" TEXT,
    "firstVisitUtmCampaign" TEXT,
    "firstVisitUtmContent" TEXT,
    "firstVisitUtmMedium" TEXT,
    "firstVisitUtmSource" TEXT,
    "firstVisitUtmTerm" TEXT,
    "lastVisitLandingPage" TEXT,
    "lastVisitOccuredAt" DATETIME,
    "lastVisitReferralCode" TEXT,
    "lastVisitReferralInfoHtml" TEXT,
    "lastVisitReferrerUrl" TEXT,
    "lastVisitSource" TEXT,
    "lastVisitSourceDescription" TEXT,
    "lastVisitSourceType" TEXT,
    "lastVisitUtmCampaign" TEXT,
    "lastVisitUtmContent" TEXT,
    "lastVisitUtmMedium" TEXT,
    "lastVisitUtmSource" TEXT,
    "lastVisitUtmTerm" TEXT
);
INSERT INTO "new_CustomerVisit" ("customerId", "customerName", "customerOrderIndex", "daysToConversion", "firstVisitLandingPage", "firstVisitOccuredAt", "firstVisitReferralCode", "firstVisitReferralInfoHtml", "firstVisitReferrerUrl", "firstVisitSource", "firstVisitSourceDescription", "firstVisitSourceType", "firstVisitUtmCampaign", "firstVisitUtmContent", "firstVisitUtmMedium", "firstVisitUtmSource", "firstVisitUtmTerm", "id", "lastVisitLandingPage", "lastVisitOccuredAt", "lastVisitReferralCode", "lastVisitReferralInfoHtml", "lastVisitReferrerUrl", "lastVisitSource", "lastVisitSourceDescription", "lastVisitSourceType", "lastVisitUtmCampaign", "lastVisitUtmContent", "lastVisitUtmMedium", "lastVisitUtmSource", "lastVisitUtmTerm", "momentsCount", "orderId", "orderName", "orderNote") SELECT "customerId", "customerName", "customerOrderIndex", "daysToConversion", "firstVisitLandingPage", "firstVisitOccuredAt", "firstVisitReferralCode", "firstVisitReferralInfoHtml", "firstVisitReferrerUrl", "firstVisitSource", "firstVisitSourceDescription", "firstVisitSourceType", "firstVisitUtmCampaign", "firstVisitUtmContent", "firstVisitUtmMedium", "firstVisitUtmSource", "firstVisitUtmTerm", "id", "lastVisitLandingPage", "lastVisitOccuredAt", "lastVisitReferralCode", "lastVisitReferralInfoHtml", "lastVisitReferrerUrl", "lastVisitSource", "lastVisitSourceDescription", "lastVisitSourceType", "lastVisitUtmCampaign", "lastVisitUtmContent", "lastVisitUtmMedium", "lastVisitUtmSource", "lastVisitUtmTerm", "momentsCount", "orderId", "orderName", "orderNote" FROM "CustomerVisit";
DROP TABLE "CustomerVisit";
ALTER TABLE "new_CustomerVisit" RENAME TO "CustomerVisit";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
