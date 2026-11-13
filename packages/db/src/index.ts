import { env } from "@webvise-app/env/server";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

// biome-ignore lint/style/noNonNullAssertion: required in production by packages/env, optional elsewhere
export const db = drizzle(env.DATABASE_URL!, { schema });
