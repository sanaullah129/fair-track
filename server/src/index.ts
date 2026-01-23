import envConfig from "./configs/envConfig";
import Server from "./Server";

const server = new Server(envConfig);
server.bootstrap().then(() => {
    server.run();
}).catch((error) => {
    console.error("Failed to bootstrap the server:", error);
    process.exit(1);
});
