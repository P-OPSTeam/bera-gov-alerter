-- CreateTable
CREATE TABLE "bera_proposal" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "bera_proposal_pkey" PRIMARY KEY ("id")
);
