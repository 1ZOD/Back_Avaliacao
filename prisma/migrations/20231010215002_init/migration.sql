-- CreateTable
CREATE TABLE "calendario" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefa" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_id" INTEGER NOT NULL,

    CONSTRAINT "tarefa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_data_id_fkey" FOREIGN KEY ("data_id") REFERENCES "calendario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
