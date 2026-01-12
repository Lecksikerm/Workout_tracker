import { AppDataSource } from "./src/database/data-source";

(async () => {
    console.log("Initializing datasource...");
    await AppDataSource.initialize();
    console.log("Datasource initialized");
    process.exit(0);
})();
