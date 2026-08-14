import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const newsletterSubscriber = pgTable("newsletter_subscriber", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull().unique(),
	placement: text("placement").notNull(),
	path: text("path").notNull(),
	status: text("status", { enum: ["pending", "confirmed"] })
		.default("pending")
		.notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	confirmedAt: timestamp("confirmed_at"),
});

export const leadEvent = pgTable(
	"lead_event",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		email: text("email").notNull(),
		eventType: text("event_type", {
			enum: ["newsletter_signup", "deck_request"],
		}).notNull(),
		placement: text("placement").notNull(),
		path: text("path").notNull(),
		topic: text("topic"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("lead_event_email_idx").on(table.email),
		index("lead_event_created_at_idx").on(table.createdAt),
	]
);
