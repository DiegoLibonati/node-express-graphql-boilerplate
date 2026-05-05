import express from "express";
import { createHandler } from "graphql-http/lib/use/express";

import { schema } from "@/schemas/schema";

import { errorHandler } from "@/middlewares/error_handler.middleware";
import { notFoundHandler } from "@/middlewares/not_found_handler.middleware";

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/graphql",
  createHandler({
    schema: schema,
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/graphiql", (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<!doctype html>
<html>
  <head>
    <title>GraphiQL</title>
    <link href="https://unpkg.com/graphiql@3/graphiql.min.css" rel="stylesheet" />
  </head>
  <body style="margin:0">
    <div id="graphiql" style="height:100vh"></div>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/graphiql@3/graphiql.min.js"></script>
    <script>
      const root = ReactDOM.createRoot(document.getElementById("graphiql"));
      root.render(
        React.createElement(GraphiQL, { fetcher: GraphiQL.createFetcher({ url: "/graphql" }) }),
      );
    </script>
  </body>
</html>`);
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
