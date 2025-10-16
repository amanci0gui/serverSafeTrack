import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Lê o arquivo GeoJSON
  const data = JSON.parse(fs.readFileSync('src/geo/exportBairros.geojson', 'utf-8'));

  // 2️⃣ Itera pelas features e prepara os dados
  const bairrosData = data.features
    .map((feature: any) => {
      const name = feature.properties.name;
      const polygon = feature.geometry;

      if (!name) return null;
      return { name, polygon };
    })
    .filter(Boolean) as { name: string; polygon: any }[];

  console.log(`ℹ️ Total de bairros a inserir: ${bairrosData.length}`);

  // 3️⃣ Insere um por um (evita timeout no SQLite)
  for (const bairro of bairrosData) {
    try {
      await prisma.bairro.create({
        data: {
          name: bairro.name,
          cidade: '',
          polygon: bairro.polygon,
        },
      });
      console.log(`✅ Bairro inserido: ${bairro.name}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠️ Bairro já existe: ${bairro.name}`);
      } else {
        console.error(`❌ Erro ao inserir ${bairro.name}:`, error);
      }
    }
  }

  console.log('🌍 Inserção de bairros concluída.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
