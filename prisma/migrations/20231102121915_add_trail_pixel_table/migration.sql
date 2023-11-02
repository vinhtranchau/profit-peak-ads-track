-- CreateTable
CREATE TABLE "TrailPixel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_name" TEXT NOT NULL,
    "order_updated_at" DATETIME NOT NULL,
    "days_to_conversion" INTEGER,
    "moments_count" INTEGER,
    "trail_pixel" TEXT,
    "synced" BOOLEAN NOT NULL DEFAULT false
);
