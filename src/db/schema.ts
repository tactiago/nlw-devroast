import {
	boolean,
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const severityEnum = pgEnum("severity", [
	"critical",
	"warning",
	"good",
]);

export const verdictEnum = pgEnum("verdict", [
	"needs_serious_help",
	"below_average",
	"average",
	"above_average",
	"impressive",
	"legendary",
]);

export const submissions = pgTable(
	"submissions",
	{
		id: uuid().primaryKey().defaultRandom(),
		code: text().notNull(),
		language: varchar({ length: 50 }).notNull(),
		lineCount: integer().notNull(),
		roastMode: boolean().notNull().default(false),
		score: numeric({ precision: 3, scale: 1 }).notNull(),
		roastQuote: text().notNull(),
		verdict: verdictEnum().notNull(),
		suggestedFix: text(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [index("idx_submissions_score").on(t.score)],
);

export const issues = pgTable("issues", {
	id: uuid().primaryKey().defaultRandom(),
	submissionId: uuid()
		.notNull()
		.references(() => submissions.id, { onDelete: "cascade" }),
	severity: severityEnum().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	position: integer().notNull().default(0),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
