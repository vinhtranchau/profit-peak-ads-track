-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pixels" (
    "id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "tp_id" TEXT,
    "tp_cid" TEXT,
    "tp_source" TEXT,
    "product_id" TEXT,
    "product_id_type" TEXT,
    "tp_datetime" TIMESTAMP(3) NOT NULL,
    "tp_session" TIMESTAMP(3) NOT NULL,
    "useragent" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "ip_address" TEXT,
    "version" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "cart_variant_id" TEXT,
    "cart_added_at" TIMESTAMP(3),
    "order_id" TEXT,
    "ordered_at" TIMESTAMP(3),

    CONSTRAINT "Pixels_pkey" PRIMARY KEY ("id")
);
