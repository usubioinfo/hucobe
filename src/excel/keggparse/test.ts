import path from 'path';
import sql from 'sqlite3';
import { open, Database } from 'sqlite';

const dataPath = path.resolve('hdata');

let db: Database;

export const translateGenes = async () => {
  db = await open({filename: `${dataPath}/hs.sqlite`, driver: sql.Database});
  let genesInfo = await db.all('SELECT * FROM genes');

  genesInfo.forEach(item => {
    console.log(item);
  });
}
