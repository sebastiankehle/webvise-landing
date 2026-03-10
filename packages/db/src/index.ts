import { env } from "@webvise-app/env/server";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

// biome-ignore lint/style/noNonNullAssertion: validated at runtime, optional at build time
export const db = drizzle(env.DATABASE_URL!, { schema });
