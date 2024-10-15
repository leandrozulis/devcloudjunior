import { app } from './src/app'
import { env } from './src/env'

app.listen(env.PORT, () => {
  console.log('Micro Serviço starting!');
})