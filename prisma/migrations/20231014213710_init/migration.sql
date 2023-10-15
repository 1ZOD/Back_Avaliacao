-- CreateTable
CREATE TABLE "calendario" (
    "id" SERIAL NOT NULL,
    "dia" TEXT NOT NULL,

    CONSTRAINT "calendario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefa" (
    "id" SERIAL NOT NULL,
    "tarefa" TEXT NOT NULL,
    "data_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "iconeId" INTEGER,
    "iconeBase64" TEXT,

    CONSTRAINT "tarefa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "icone" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "icone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_data_id_fkey" FOREIGN KEY ("data_id") REFERENCES "calendario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_iconeId_fkey" FOREIGN KEY ("iconeId") REFERENCES "icone"("id") ON DELETE SET NULL ON UPDATE CASCADE;


INSERT INTO "icone" ("nome", "url") VALUES
  ('Ícone 1', 'url_1'),
  ('Ícone 2', 'url_2'),
  ('Ícone 3', 'url_3');
