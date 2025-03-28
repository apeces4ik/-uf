import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Players
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  number: integer("number").notNull(),
  age: integer("age").notNull(),
  matches: integer("matches").default(0),
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  cleanSheets: integer("clean_sheets").default(0),
  imageUrl: text("image_url"),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

// Coaches
export const coaches = pgTable("coaches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  joinYear: integer("join_year").notNull(),
  achievements: text("achievements"),
  imageUrl: text("image_url"),
});

export const insertCoachSchema = createInsertSchema(coaches).omit({
  id: true,
});

export type InsertCoach = z.infer<typeof insertCoachSchema>;
export type Coach = typeof coaches.$inferSelect;

// Matches
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  competition: text("competition").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  homeTeamLogo: text("home_team_logo"),
  awayTeamLogo: text("away_team_logo"),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  stadium: text("stadium").notNull(),
  status: text("status").default("upcoming").notNull(), // upcoming, completed, canceled
  round: text("round"),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
});

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

// News
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  date: text("date").notNull(),
  views: integer("views").default(0),
  comments: integer("comments").default(0),
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: integer("author_id").notNull(),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar"),
  date: text("date").notNull(),
  imageUrl: text("image_url"),
  views: integer("views").default(0),
  comments: integer("comments").default(0),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Media (photos and videos)
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // photo, video
  title: text("title"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category"),
  date: text("date").notNull(),
  duration: text("duration"), // for videos
  views: integer("views").default(0),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

// Tournament standings
export const standings = pgTable("standings", {
  id: serial("id").primaryKey(),
  team: text("team").notNull(),
  position: integer("position").notNull(),
  played: integer("played").notNull(),
  won: integer("won").notNull(),
  drawn: integer("drawn").notNull(),
  lost: integer("lost").notNull(),
  goalsFor: integer("goals_for").notNull(),
  goalsAgainst: integer("goals_against").notNull(),
  points: integer("points").notNull(),
});

export const insertStandingSchema = createInsertSchema(standings).omit({
  id: true,
});

export type InsertStanding = z.infer<typeof insertStandingSchema>;
export type Standing = typeof standings.$inferSelect;

// Contact messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  date: text("date").notNull(),
  read: boolean("read").default(false),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  read: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Club History
export const clubHistory = pgTable("club_history", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  importance: integer("importance").default(1), // 1-3, where 3 is most important
});

export const insertHistorySchema = createInsertSchema(clubHistory).omit({
  id: true,
});

export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type History = typeof clubHistory.$inferSelect;
