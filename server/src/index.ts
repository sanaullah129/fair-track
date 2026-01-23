import envConfig from "./configs/envConfig";
import Server from "./Server";

const server = new Server(envConfig);
server.bootstrap();
server.run();