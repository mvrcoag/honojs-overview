import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { z } from "zod";

const usersRouter = new Hono();

type User = {
  id: number;
  name: string;
};

const Layout: FC = ({ children }) => (
  <html>
    <head>
      <title>Hono Users</title>
      <link rel="stylesheet" href="https://matcha.mizu.sh/matcha.css" />
    </head>
    <body>
      <header>
        <h1>Hono Users</h1>
      </header>
      {children}
    </body>
  </html>
);

function UserList({ users }: { users: User[] }) {
  return (
    <Layout>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </Layout>
  );
}

const users: User[] = [
  {
    id: 1,
    name: "Marco",
  },
];

usersRouter.get("/html", (c) => {
  return c.html(<UserList users={users} />);
});

usersRouter.get("/", (c) => {
  return c.json({ users });
});

usersRouter.get("/:id", (c) => {
  const id = c.req.param("id");
  const user = users.find((u) => u.id === parseInt(id));
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }
  return c.json({ user });
});

usersRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string(),
    })
  ),
  async (c) => {
    const body = c.req.valid("json");

    users.push({
      id: users.length + 1,
      name: body.name,
    });

    return c.json({ message: "User created" });
  }
);

usersRouter.delete(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.string().refine((v) => parseInt(v) > 0) })
  ),
  (c) => {
    const id = c.req.param("id");
    const userIndex = users.findIndex((u) => u.id === parseInt(id));
    if (userIndex === -1) {
      return c.json({ error: "User not found" }, 404);
    }
    users.splice(userIndex, 1);
    return c.json({ message: "User deleted" });
  }
);

export default usersRouter;
