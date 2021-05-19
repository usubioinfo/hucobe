require('tsconfig-paths/register');
import { translateGenes } from './keggparse/parse';

(async () => {
  await translateGenes();
})();
