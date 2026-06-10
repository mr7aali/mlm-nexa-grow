const { createServer } = require("http");
const next = require("next");

const dev = false;
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error("Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(port, () => {
    console.log(`Next.js frontend running on port ${port}`);
  });
});
