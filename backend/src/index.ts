import { createServer } from './server';
import { env } from './common/env';

const app = createServer();

app.listen(env.PORT, () => {
  console.log(`Backend lancé sur http://localhost:${env.PORT}`);
});
