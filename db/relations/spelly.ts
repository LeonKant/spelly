import { relations } from "drizzle-orm/relations";
import { profilesInSpelly, lobbiesInSpelly } from "../schema/spelly";
import { usersInAuth } from "../schema/auth";

export const profilesInSpellyRelations = relations(profilesInSpelly, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profilesInSpelly.id],
		references: [usersInAuth.id]
	}),
	lobbiesInSpellies: many(lobbiesInSpelly),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profilesInSpellies: many(profilesInSpelly),
}));

export const lobbiesInSpellyRelations = relations(lobbiesInSpelly, ({one}) => ({
	profilesInSpelly: one(profilesInSpelly, {
		fields: [lobbiesInSpelly.hostId],
		references: [profilesInSpelly.id]
	}),
}));