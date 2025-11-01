-- CreateTable
CREATE TABLE "Pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bairroId" INTEGER NOT NULL,
    "moradorId" INTEGER NOT NULL,
    "representanteId" INTEGER NOT NULL,
    CONSTRAINT "Pedido_bairroId_fkey" FOREIGN KEY ("bairroId") REFERENCES "Bairro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pedido_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pedido_representanteId_fkey" FOREIGN KEY ("representanteId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
