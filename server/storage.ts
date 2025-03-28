import { users, type User, type InsertUser } from "@shared/schema";
import { players, type Player, type InsertPlayer } from "@shared/schema";
import { coaches, type Coach, type InsertCoach } from "@shared/schema";
import { matches, type Match, type InsertMatch } from "@shared/schema";
import { news, type News, type InsertNews } from "@shared/schema";
import { blogPosts, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { media, type Media, type InsertMedia } from "@shared/schema";
import { standings, type Standing, type InsertStanding } from "@shared/schema";
import { contactMessages, type ContactMessage, type InsertContactMessage } from "@shared/schema";
import { clubHistory, type History, type InsertHistory } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Players
  getPlayers(): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<boolean>;
  
  // Coaches
  getCoaches(): Promise<Coach[]>;
  getCoachById(id: number): Promise<Coach | undefined>;
  createCoach(coach: InsertCoach): Promise<Coach>;
  updateCoach(id: number, coach: Partial<InsertCoach>): Promise<Coach | undefined>;
  deleteCoach(id: number): Promise<boolean>;
  
  // Matches
  getMatches(): Promise<Match[]>;
  getUpcomingMatches(limit?: number): Promise<Match[]>;
  getCompletedMatches(limit?: number): Promise<Match[]>;
  getMatchById(id: number): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, match: Partial<InsertMatch>): Promise<Match | undefined>;
  deleteMatch(id: number): Promise<boolean>;
  
  // News
  getNews(limit?: number): Promise<News[]>;
  getNewsById(id: number): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, news: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: number): Promise<boolean>;
  
  // Blog posts
  getBlogPosts(limit?: number): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Media
  getMedia(type?: string, limit?: number): Promise<Media[]>;
  getMediaById(id: number): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  updateMedia(id: number, media: Partial<InsertMedia>): Promise<Media | undefined>;
  deleteMedia(id: number): Promise<boolean>;
  
  // Standings
  getStandings(): Promise<Standing[]>;
  updateStanding(id: number, standing: Partial<InsertStanding>): Promise<Standing | undefined>;
  createStanding(standing: InsertStanding): Promise<Standing>;
  
  // Contact messages
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessageById(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;
  
  // Club History
  getHistory(): Promise<History[]>;
  getHistoryById(id: number): Promise<History | undefined>;
  createHistory(history: InsertHistory): Promise<History>;
  updateHistory(id: number, history: Partial<InsertHistory>): Promise<History | undefined>;
  deleteHistory(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private players: Map<number, Player>;
  private coaches: Map<number, Coach>;
  private matches: Map<number, Match>;
  private newsItems: Map<number, News>;
  private blogPosts: Map<number, BlogPost>;
  private mediaItems: Map<number, Media>;
  private standingItems: Map<number, Standing>;
  private contactMessages: Map<number, ContactMessage>;
  private historyItems: Map<number, History>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private playerIdCounter: number;
  private coachIdCounter: number;
  private matchIdCounter: number;
  private newsIdCounter: number;
  private blogIdCounter: number;
  private mediaIdCounter: number;
  private standingIdCounter: number;
  private messageIdCounter: number;
  private historyIdCounter: number;

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.coaches = new Map();
    this.matches = new Map();
    this.newsItems = new Map();
    this.blogPosts = new Map();
    this.mediaItems = new Map();
    this.standingItems = new Map();
    this.contactMessages = new Map();
    this.historyItems = new Map();
    
    this.userIdCounter = 1;
    this.playerIdCounter = 1;
    this.coachIdCounter = 1;
    this.matchIdCounter = 1;
    this.newsIdCounter = 1;
    this.blogIdCounter = 1;
    this.mediaIdCounter = 1;
    this.standingIdCounter = 1;
    this.messageIdCounter = 1;
    this.historyIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every day
    });
    
    // Initialize with a default admin
    this.createUser({
      username: "admin",
      password: "c30d9b00fd8546a211b33fdf08ebb3c0aeaf32acd2b9eb0eb2e1e1c2fe9acd81af99d51e2076303e28cbf0df987a2ede9e2c2c2a0b589f1ddb97c8dd08823a2.b77cb5f6eefe9af7f04a0c48aae49150", // admin123
    }).then(user => {
      this.users.set(user.id, {...user, isAdmin: true});
    });
    
    // Initialize with some dummy data for development
    this.seedInitialData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }
  
  // Players
  async getPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }
  
  async getPlayerById(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }
  
  async createPlayer(player: InsertPlayer): Promise<Player> {
    const id = this.playerIdCounter++;
    const newPlayer: Player = { ...player, id };
    this.players.set(id, newPlayer);
    return newPlayer;
  }
  
  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    const existingPlayer = this.players.get(id);
    if (!existingPlayer) return undefined;
    
    const updatedPlayer = { ...existingPlayer, ...player };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }
  
  async deletePlayer(id: number): Promise<boolean> {
    return this.players.delete(id);
  }
  
  // Coaches
  async getCoaches(): Promise<Coach[]> {
    return Array.from(this.coaches.values());
  }
  
  async getCoachById(id: number): Promise<Coach | undefined> {
    return this.coaches.get(id);
  }
  
  async createCoach(coach: InsertCoach): Promise<Coach> {
    const id = this.coachIdCounter++;
    const newCoach: Coach = { ...coach, id };
    this.coaches.set(id, newCoach);
    return newCoach;
  }
  
  async updateCoach(id: number, coach: Partial<InsertCoach>): Promise<Coach | undefined> {
    const existingCoach = this.coaches.get(id);
    if (!existingCoach) return undefined;
    
    const updatedCoach = { ...existingCoach, ...coach };
    this.coaches.set(id, updatedCoach);
    return updatedCoach;
  }
  
  async deleteCoach(id: number): Promise<boolean> {
    return this.coaches.delete(id);
  }
  
  // Matches
  async getMatches(): Promise<Match[]> {
    return Array.from(this.matches.values());
  }
  
  async getUpcomingMatches(limit?: number): Promise<Match[]> {
    const upcoming = Array.from(this.matches.values())
      .filter(match => match.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return limit ? upcoming.slice(0, limit) : upcoming;
  }
  
  async getCompletedMatches(limit?: number): Promise<Match[]> {
    const completed = Array.from(this.matches.values())
      .filter(match => match.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? completed.slice(0, limit) : completed;
  }
  
  async getMatchById(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }
  
  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.matchIdCounter++;
    const newMatch: Match = { ...match, id };
    this.matches.set(id, newMatch);
    return newMatch;
  }
  
  async updateMatch(id: number, match: Partial<InsertMatch>): Promise<Match | undefined> {
    const existingMatch = this.matches.get(id);
    if (!existingMatch) return undefined;
    
    const updatedMatch = { ...existingMatch, ...match };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }
  
  async deleteMatch(id: number): Promise<boolean> {
    return this.matches.delete(id);
  }
  
  // News
  async getNews(limit?: number): Promise<News[]> {
    const allNews = Array.from(this.newsItems.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? allNews.slice(0, limit) : allNews;
  }
  
  async getNewsById(id: number): Promise<News | undefined> {
    return this.newsItems.get(id);
  }
  
  async createNews(news: InsertNews): Promise<News> {
    const id = this.newsIdCounter++;
    const newNews: News = { ...news, id };
    this.newsItems.set(id, newNews);
    return newNews;
  }
  
  async updateNews(id: number, news: Partial<InsertNews>): Promise<News | undefined> {
    const existingNews = this.newsItems.get(id);
    if (!existingNews) return undefined;
    
    const updatedNews = { ...existingNews, ...news };
    this.newsItems.set(id, updatedNews);
    return updatedNews;
  }
  
  async deleteNews(id: number): Promise<boolean> {
    return this.newsItems.delete(id);
  }
  
  // Blog posts
  async getBlogPosts(limit?: number): Promise<BlogPost[]> {
    const allPosts = Array.from(this.blogPosts.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? allPosts.slice(0, limit) : allPosts;
  }
  
  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogIdCounter++;
    const newPost: BlogPost = { ...post, id };
    this.blogPosts.set(id, newPost);
    return newPost;
  }
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost = { ...existingPost, ...post };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
  
  // Media
  async getMedia(type?: string, limit?: number): Promise<Media[]> {
    let mediaList = Array.from(this.mediaItems.values());
    
    if (type) {
      mediaList = mediaList.filter(item => item.type === type);
    }
    
    mediaList = mediaList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? mediaList.slice(0, limit) : mediaList;
  }
  
  async getMediaById(id: number): Promise<Media | undefined> {
    return this.mediaItems.get(id);
  }
  
  async createMedia(media: InsertMedia): Promise<Media> {
    const id = this.mediaIdCounter++;
    const newMedia: Media = { ...media, id };
    this.mediaItems.set(id, newMedia);
    return newMedia;
  }
  
  async updateMedia(id: number, media: Partial<InsertMedia>): Promise<Media | undefined> {
    const existingMedia = this.mediaItems.get(id);
    if (!existingMedia) return undefined;
    
    const updatedMedia = { ...existingMedia, ...media };
    this.mediaItems.set(id, updatedMedia);
    return updatedMedia;
  }
  
  async deleteMedia(id: number): Promise<boolean> {
    return this.mediaItems.delete(id);
  }
  
  // Standings
  async getStandings(): Promise<Standing[]> {
    return Array.from(this.standingItems.values())
      .sort((a, b) => a.position - b.position);
  }
  
  async updateStanding(id: number, standing: Partial<InsertStanding>): Promise<Standing | undefined> {
    const existingStanding = this.standingItems.get(id);
    if (!existingStanding) return undefined;
    
    const updatedStanding = { ...existingStanding, ...standing };
    this.standingItems.set(id, updatedStanding);
    return updatedStanding;
  }
  
  async createStanding(standing: InsertStanding): Promise<Standing> {
    const id = this.standingIdCounter++;
    const newStanding: Standing = { ...standing, id };
    this.standingItems.set(id, newStanding);
    return newStanding;
  }
  
  // Contact messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getContactMessageById(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }
  
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.messageIdCounter++;
    const newMessage: ContactMessage = { ...message, id, read: false };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }
  
  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const existingMessage = this.contactMessages.get(id);
    if (!existingMessage) return undefined;
    
    const updatedMessage = { ...existingMessage, read: true };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
  }
  
  // Club History
  async getHistory(): Promise<History[]> {
    return Array.from(this.historyItems.values())
      .sort((a, b) => a.year - b.year); // Sort by year ascending
  }
  
  async getHistoryById(id: number): Promise<History | undefined> {
    return this.historyItems.get(id);
  }
  
  async createHistory(history: InsertHistory): Promise<History> {
    const id = this.historyIdCounter++;
    const newHistory: History = { ...history, id };
    this.historyItems.set(id, newHistory);
    return newHistory;
  }
  
  async updateHistory(id: number, history: Partial<InsertHistory>): Promise<History | undefined> {
    const existingHistory = this.historyItems.get(id);
    if (!existingHistory) return undefined;
    
    const updatedHistory = { ...existingHistory, ...history };
    this.historyItems.set(id, updatedHistory);
    return updatedHistory;
  }
  
  async deleteHistory(id: number): Promise<boolean> {
    return this.historyItems.delete(id);
  }
  
  // Seed initial data for development
  private async seedInitialData() {
    // Seed standings
    const standingsData: InsertStanding[] = [
      { team: "Динамо", position: 1, played: 23, won: 18, drawn: 3, lost: 2, goalsFor: 48, goalsAgainst: 12, points: 57 },
      { team: "Зенит", position: 2, played: 23, won: 16, drawn: 4, lost: 3, goalsFor: 45, goalsAgainst: 18, points: 52 },
      { team: "Александрия", position: 3, played: 23, won: 15, drawn: 5, lost: 3, goalsFor: 39, goalsAgainst: 21, points: 50 },
      { team: "Спартак", position: 4, played: 23, won: 13, drawn: 5, lost: 5, goalsFor: 36, goalsAgainst: 22, points: 44 },
      { team: "ЦСКА", position: 5, played: 23, won: 11, drawn: 8, lost: 4, goalsFor: 31, goalsAgainst: 19, points: 41 },
    ];
    
    for (const standing of standingsData) {
      await this.createStanding(standing);
    }
    
    // Seed matches
    const matchesData: InsertMatch[] = [
      {
        date: "2023-05-15",
        time: "19:30",
        competition: "Кубок страны",
        homeTeam: "Александрия",
        awayTeam: "Динамо",
        homeTeamLogo: "А",
        awayTeamLogo: "Д",
        stadium: "Центральный",
        status: "upcoming",
        round: "Полуфинал",
      },
      {
        date: "2023-05-21",
        time: "17:00",
        competition: "Чемпионат",
        homeTeam: "Спартак",
        awayTeam: "Александрия",
        homeTeamLogo: "С",
        awayTeamLogo: "А",
        stadium: "Спартак Арена",
        status: "upcoming",
        round: "Тур 24",
      },
      {
        date: "2023-05-28",
        time: "20:00",
        competition: "Чемпионат",
        homeTeam: "Александрия",
        awayTeam: "Зенит",
        homeTeamLogo: "А",
        awayTeamLogo: "З",
        stadium: "Центральный",
        status: "upcoming",
        round: "Тур 25",
      },
      {
        date: "2023-05-07",
        time: "18:00",
        competition: "Чемпионат",
        homeTeam: "Александрия",
        awayTeam: "Спартак",
        homeTeamLogo: "А",
        awayTeamLogo: "С",
        homeScore: 2,
        awayScore: 0,
        stadium: "Центральный",
        status: "completed",
        round: "Тур 23",
      },
    ];
    
    for (const match of matchesData) {
      await this.createMatch(match);
    }
    
    // Seed players
    const playersData: InsertPlayer[] = [
      {
        name: "Александр Иванов",
        position: "Вратарь",
        number: 1,
        age: 28,
        matches: 21,
        goals: 0,
        assists: 0,
        cleanSheets: 9,
        imageUrl: "https://images.unsplash.com/photo-1546083381-2bed38b1a8ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500&q=80",
      },
      {
        name: "Сергей Петров",
        position: "Защитник",
        number: 5,
        age: 26,
        matches: 23,
        goals: 2,
        assists: 1,
        cleanSheets: 0,
        imageUrl: "https://images.unsplash.com/photo-1633467067670-3e3c79da4d7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500&q=80",
      },
      {
        name: "Николай Смирнов",
        position: "Полузащитник",
        number: 8,
        age: 24,
        matches: 22,
        goals: 5,
        assists: 7,
        cleanSheets: 0,
        imageUrl: "https://images.unsplash.com/photo-1616473644513-dfa92ceb6641?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500&q=80",
      },
      {
        name: "Виктор Козлов",
        position: "Нападающий",
        number: 10,
        age: 27,
        matches: 23,
        goals: 12,
        assists: 5,
        cleanSheets: 0,
        imageUrl: "https://images.unsplash.com/photo-1570498839593-e565b39455fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500&q=80",
      },
      {
        name: "Дмитрий Соколов",
        position: "Защитник",
        number: 15,
        age: 25,
        matches: 20,
        goals: 1,
        assists: 0,
        cleanSheets: 0,
        imageUrl: "https://images.unsplash.com/photo-1624059560699-74531a47c49b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500&q=80",
      },
    ];
    
    for (const player of playersData) {
      await this.createPlayer(player);
    }
    
    // Seed coaches
    const coachesData: InsertCoach[] = [
      {
        name: "Андрей Шевченко",
        position: "Главный тренер",
        joinYear: 2021,
        achievements: "Кубок 2022",
        imageUrl: "https://images.unsplash.com/photo-1531891570158-e71b35a485bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Игорь Белов",
        position: "Ассистент",
        joinYear: 2021,
        achievements: "Специализация: Защита",
        imageUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Павел Черных",
        position: "Тренер вратарей",
        joinYear: 2020,
        achievements: "Бывший вратарь сборной",
        imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      },
    ];
    
    for (const coach of coachesData) {
      await this.createCoach(coach);
    }
    
    // Seed news
    const newsData: InsertNews[] = [
      {
        title: "Важная победа команды в матче против лидера чемпионата",
        content: "Подробный отчет о матче и анализ ключевых моментов игры.",
        excerpt: "Команда одержала важную победу в матче против лидера чемпионата.",
        imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
        category: "Матч",
        date: "2023-05-10",
        views: 1200,
        comments: 24,
      },
      {
        title: "Клуб подписал нового талантливого нападающего",
        content: "Информация о новом игроке, его карьере и ожиданиях от выступлений за клуб.",
        excerpt: "Новый нападающий присоединился к команде.",
        imageUrl: "https://images.unsplash.com/photo-1520473378652-85d9c4aee6cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=200&q=80",
        category: "Трансфер",
        date: "2023-05-08",
        views: 980,
        comments: 15,
      },
      {
        title: "Интервью главного тренера о планах на сезон",
        content: "Главный тренер делится своими мыслями о текущем сезоне и планах на будущее.",
        excerpt: "Главный тренер рассказал о планах команды на остаток сезона.",
        imageUrl: "https://images.unsplash.com/photo-1579710758949-3ab56a3b3114?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=200&q=80",
        category: "Интервью",
        date: "2023-05-05",
        views: 750,
        comments: 8,
      },
      {
        title: "Тренировка команды перед важным матчем кубка",
        content: "Отчет о подготовке команды к предстоящему полуфиналу кубка страны.",
        excerpt: "Команда активно готовится к предстоящему полуфиналу кубка страны.",
        imageUrl: "https://images.unsplash.com/photo-1547247865-5732fd2c351b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=250&q=80",
        category: "Тренировка",
        date: "2023-05-08",
        views: 342,
        comments: 4,
      },
      {
        title: "Открытая тренировка для болельщиков клуба",
        content: "Информация о предстоящей открытой тренировке для болельщиков.",
        excerpt: "В эту субботу состоится открытая тренировка для болельщиков.",
        imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=250&q=80",
        category: "Событие",
        date: "2023-05-06",
        views: 518,
        comments: 7,
      },
      {
        title: "Новая домашняя форма на следующий сезон",
        content: "Презентация новой домашней формы команды на следующий сезон.",
        excerpt: "Клуб представил новую домашнюю форму на следующий сезон.",
        imageUrl: "https://images.unsplash.com/photo-1622459032479-afd05e326472?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=250&q=80",
        category: "Клуб",
        date: "2023-05-05",
        views: 476,
        comments: 9,
      },
    ];
    
    for (const newsItem of newsData) {
      await this.createNews(newsItem);
    }
    
    // Seed blog posts
    const blogData: InsertBlogPost[] = [
      {
        title: "Анализ тактики: как мы перестроили игру в середине сезона",
        content: "Подробный разбор тактических изменений, которые помогли команде улучшить результаты.",
        excerpt: "Разбор тактических изменений, которые помогли команде улучшить результаты во второй половине чемпионата.",
        authorId: 1,
        authorName: "Андрей Шевченко",
        authorAvatar: "https://images.unsplash.com/photo-1531891570158-e71b35a485bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80",
        date: "2023-05-03",
        imageUrl: "https://images.unsplash.com/photo-1626248801379-51a0748a5f96?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
        views: 1200,
        comments: 8,
      },
      {
        title: "Оборонительные схемы современного футбола",
        content: "Анализ эволюции оборонительных схем в современном футболе.",
        excerpt: "Как эволюционировали оборонительные схемы в современном футболе и какие из них используем мы.",
        authorId: 2,
        authorName: "Игорь Белов",
        authorAvatar: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80",
        date: "2023-04-28",
        imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
        views: 985,
        comments: 5,
      },
      {
        title: "Работа с молодыми вратарями: секреты подготовки",
        content: "Методика работы с молодыми талантливыми вратарями.",
        excerpt: "Опыт работы с молодыми талантливыми вратарями и методика их подготовки к профессиональному футболу.",
        authorId: 3,
        authorName: "Павел Черных",
        authorAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80",
        date: "2023-04-25",
        imageUrl: "https://images.unsplash.com/photo-1624526267942-ab0c0e53d0e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
        views: 764,
        comments: 3,
      },
    ];
    
    for (const post of blogData) {
      await this.createBlogPost(post);
    }
    
    // Seed media
    const mediaData: InsertMedia[] = [
      {
        type: "photo",
        title: "Фото матча",
        url: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        category: "Матчи",
        date: "2023-05-07",
      },
      {
        type: "photo",
        title: "Фото матча",
        url: "https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        category: "Матчи",
        date: "2023-05-07",
      },
      {
        type: "photo",
        title: "Тренировка команды",
        url: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        category: "Тренировки",
        date: "2023-05-04",
      },
      {
        type: "photo",
        title: "Стадион",
        url: "https://images.unsplash.com/photo-1577223625816-6599880d5e2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        category: "Стадион",
        date: "2023-05-01",
      },
      {
        type: "photo",
        title: "Празднование гола",
        url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        category: "Матчи",
        date: "2023-05-07",
      },
      {
        type: "photo",
        title: "Болельщики",
        url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        category: "Болельщики",
        date: "2023-05-07",
      },
      {
        type: "photo",
        title: "Интервью",
        url: "https://images.unsplash.com/photo-1577223625816-6599880d5e2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        category: "Интервью",
        date: "2023-05-08",
      },
      {
        type: "photo",
        title: "Командное фото",
        url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        category: "Команда",
        date: "2023-05-02",
      },
      {
        type: "video",
        title: "Обзор матча: Александрия 2:0 Динамо",
        url: "https://example.com/video1",
        thumbnailUrl: "https://images.unsplash.com/photo-1542673211-9cf58c7e018c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=340&q=80",
        category: "Обзоры",
        date: "2023-05-07",
        duration: "12:34",
        views: 8500,
      },
      {
        type: "video",
        title: "Интервью с Виктором Козловым после матча",
        url: "https://example.com/video2",
        thumbnailUrl: "https://images.unsplash.com/photo-1511886929837-354d1301068d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=340&q=80",
        category: "Интервью",
        date: "2023-05-07",
        duration: "5:47",
        views: 4200,
      },
      {
        type: "video",
        title: "Топ-10 голов команды в текущем сезоне",
        url: "https://example.com/video3",
        thumbnailUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=340&q=80",
        category: "Голы",
        date: "2023-05-05",
        duration: "8:21",
        views: 12300,
      },
    ];
    
    for (const item of mediaData) {
      await this.createMedia(item);
    }
    
    // Seed club history
    const historyData: InsertHistory[] = [
      {
        year: 1995,
        title: "Основание клуба",
        description: "ФК 'Александрия' был основан группой энтузиастов и любителей футбола. Первый состав команды был собран из местных игроков.",
        importance: 3,
        imageUrl: "https://images.unsplash.com/photo-1562552476-8ac59b2a2e46?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
      },
      {
        year: 2001,
        title: "Первый трофей",
        description: "Клуб выиграл свой первый трофей - Кубок области. Это стало важной вехой в истории команды и началом восхождения в футбольной иерархии.",
        importance: 2,
        imageUrl: "https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
      },
      {
        year: 2008,
        title: "Выход в высший дивизион",
        description: "После нескольких лет упорной борьбы в низших лигах, клуб добился права выступать в высшем дивизионе страны.",
        importance: 3,
        imageUrl: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
      },
      {
        year: 2012,
        title: "Открытие новой тренировочной базы",
        description: "Открытие современной тренировочной базы с несколькими полями и новым спортивным комплексом для команды.",
        importance: 2,
        imageUrl: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
      },
      {
        year: 2015,
        title: "Первое участие в еврокубках",
        description: "ФК 'Александрия' впервые принял участие в европейских турнирах, выступив в квалификации Лиги Европы.",
        importance: 3,
        imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
      },
      {
        year: 2019,
        title: "Бронзовые медали чемпионата",
        description: "Клуб завоевал бронзовые медали чемпионата, показав лучший результат в своей истории.",
        importance: 2,
        imageUrl: "https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
      },
      {
        year: 2022,
        title: "Победа в Кубке страны",
        description: "Историческая победа в финале Кубка страны над принципиальным соперником со счетом 2:1.",
        importance: 3,
        imageUrl: "https://images.unsplash.com/photo-1596778402543-47042ab4592f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
      },
    ];
    
    for (const item of historyData) {
      await this.createHistory(item);
    }
  }
}

export const storage = new MemStorage();
