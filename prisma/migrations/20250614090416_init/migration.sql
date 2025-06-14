-- CreateTable
CREATE TABLE "booking" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);
