import { serve } from "@hono/node-server";
import { Hono } from "hono";
import usersRouter from "./routes/users";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/users", usersRouter);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
