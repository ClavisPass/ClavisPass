import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagePath = join(__dirname, "..", "test-pages", "webauthn-get.html");
const port = Number(process.env.PORT || 8787);

const server = createServer(async (request, response) => {
  if (request.url !== "/" && request.url !== "/webauthn-get.html") {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  try {
    const html = await readFile(pagePath, "utf8");
    response.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    });
    response.end(html);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Failed to load test page");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`ClavisPass WebAuthn test page: http://localhost:${port}/`);
});
