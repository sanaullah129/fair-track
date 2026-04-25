import envConfig from "./configs/envConfig";
import Server from "./Server";
import serverless from "serverless-http";

let handler: any;

const buildHandler = async (): Promise<any> => {
  const server = new Server(envConfig);
  await server.bootstrap();
  return serverless(server.application);
};

export default async function (req: any, res: any) {
  if (!handler) {
    handler = await buildHandler();
  }
  return handler(req, res);
}
