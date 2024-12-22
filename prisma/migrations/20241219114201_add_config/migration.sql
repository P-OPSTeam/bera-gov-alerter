-- CreateTable
CREATE TABLE "config" (
    "id" SERIAL NOT NULL,
    "last_block_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);
