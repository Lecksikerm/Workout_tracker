import { AppDataSource } from './src/database/data-source';

async function run() {
  console.log('Initializing datasource...');
  await AppDataSource.initialize();
  console.log('Datasource initialized');
  process.exit(0);
}

run().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
