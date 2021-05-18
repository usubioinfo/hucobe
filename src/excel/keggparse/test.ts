import path from 'path';
import sql from 'sqlite3';
import { open, Database } from 'sqlite';

const dataPath = path.resolve('hdata');

let db: Database;

export const translateGenes = async () => {
  db = await open({filename: `${dataPath}/hs.sqlite`, driver: sql.Database});
  let genesInfo = await db.all('SELECT * FROM genes');
  let aliases = await db.all('SELECT * FROM alias');

  let combined: any[] = [];

  genesInfo.forEach((item, index) => {
    const newObj = {
      geneId: item.gene_id,
      ...aliases[index]
    };

    combined.push(newObj);
  });

  combined.forEach(item => {
    console.log(item);
  });
}
