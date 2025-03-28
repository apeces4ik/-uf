import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPlayerSchema, insertCoachSchema, insertMatchSchema, insertNewsSchema, insertBlogPostSchema, insertMediaSchema, insertStandingSchema, insertContactMessageSchema, insertHistorySchema } from "@shared/schema";
import { format } from "date-fns";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  setupAuth(app);

  // API routes
  
  // Players
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении игроков" });
    }
  });
  
  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayerById(id);
      
      if (!player) {
        return res.status(404).json({ error: "Игрок не найден" });
      }
      
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении игрока" });
    }
  });
  
  app.post("/api/players", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при создании игрока" });
    }
  });
  
  app.put("/api/players/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertPlayerSchema.partial().parse(req.body);
      const player = await storage.updatePlayer(id, validatedData);
      
      if (!player) {
        return res.status(404).json({ error: "Игрок не найден" });
      }
      
      res.json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при обновлении игрока" });
    }
  });
  
  app.delete("/api/players/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deletePlayer(id);
      
      if (!success) {
        return res.status(404).json({ error: "Игрок не найден" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Ошибка при удалении игрока" });
    }
  });
  
  // Coaches
  app.get("/api/coaches", async (req, res) => {
    try {
      const coaches = await storage.getCoaches();
      res.json(coaches);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении тренеров" });
    }
  });
  
  app.get("/api/coaches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const coach = await storage.getCoachById(id);
      
      if (!coach) {
        return res.status(404).json({ error: "Тренер не найден" });
      }
      
      res.json(coach);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении тренера" });
    }
  });
  
  app.post("/api/coaches", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const validatedData = insertCoachSchema.parse(req.body);
      const coach = await storage.createCoach(validatedData);
      res.status(201).json(coach);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при создании тренера" });
    }
  });
  
  app.put("/api/coaches/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertCoachSchema.partial().parse(req.body);
      const coach = await storage.updateCoach(id, validatedData);
      
      if (!coach) {
        return res.status(404).json({ error: "Тренер не найден" });
      }
      
      res.json(coach);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при обновлении тренера" });
    }
  });
  
  app.delete("/api/coaches/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteCoach(id);
      
      if (!success) {
        return res.status(404).json({ error: "Тренер не найден" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Ошибка при удалении тренера" });
    }
  });
  
  // Matches
  app.get("/api/matches", async (req, res) => {
    try {
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении матчей" });
    }
  });
  
  app.get("/api/matches/upcoming", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const matches = await storage.getUpcomingMatches(limit);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении предстоящих матчей" });
    }
  });
  
  app.get("/api/matches/completed", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const matches = await storage.getCompletedMatches(limit);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении завершенных матчей" });
    }
  });
  
  app.get("/api/matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const match = await storage.getMatchById(id);
      
      if (!match) {
        return res.status(404).json({ error: "Матч не найден" });
      }
      
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении матча" });
    }
  });
  
  app.post("/api/matches", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const validatedData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validatedData);
      res.status(201).json(match);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при создании матча" });
    }
  });
  
  app.put("/api/matches/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertMatchSchema.partial().parse(req.body);
      const match = await storage.updateMatch(id, validatedData);
      
      if (!match) {
        return res.status(404).json({ error: "Матч не найден" });
      }
      
      res.json(match);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при обновлении матча" });
    }
  });
  
  app.delete("/api/matches/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteMatch(id);
      
      if (!success) {
        return res.status(404).json({ error: "Матч не найден" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Ошибка при удалении матча" });
    }
  });
  
  // News
  app.get("/api/news", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const newsItems = await storage.getNews(limit);
      res.json(newsItems);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении новостей" });
    }
  });
  
  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const newsItem = await storage.getNewsById(id);
      
      if (!newsItem) {
        return res.status(404).json({ error: "Новость не найдена" });
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении новости" });
    }
  });
  
  app.post("/api/news", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const validatedData = insertNewsSchema.parse(req.body);
      const newsItem = await storage.createNews(validatedData);
      res.status(201).json(newsItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при создании новости" });
    }
  });
  
  app.put("/api/news/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const newsItem = await storage.updateNews(id, validatedData);
      
      if (!newsItem) {
        return res.status(404).json({ error: "Новость не найдена" });
      }
      
      res.json(newsItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при обновлении новости" });
    }
  });
  
  app.delete("/api/news/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteNews(id);
      
      if (!success) {
        return res.status(404).json({ error: "Новость не найдена" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Ошибка при удалении новости" });
    }
  });
  
  // Blog posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const posts = await storage.getBlogPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении блог-постов" });
    }
  });
  
  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPostById(id);
      
      if (!post) {
        return res.status(404).json({ error: "Блог-пост не найден" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении блог-поста" });
    }
  });
  
  app.post("/api/blog-posts", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при создании блог-поста" });
    }
  });
  
  app.put("/api/blog-posts/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      
      if (!post) {
        return res.status(404).json({ error: "Блог-пост не найден" });
      }
      
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при обновлении блог-поста" });
    }
  });
  
  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ error: "Блог-пост не найден" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Ошибка при удалении блог-поста" });
    }
  });
  
  // Albums
  app.get("/api/albums", async (req, res) => {
    try {
      // Получить все альбомы
      // Поскольку отдельного метода для получения альбомов нет, используем getMedia с фильтрацией
      const mediaItems = await storage.getMedia();
      // Получаем уникальные albumId
      const albumIds = [...new Set(mediaItems
        .filter(item => item.albumId !== null && item.albumId !== undefined)
        .map(item => item.albumId))];
      
      // Формируем объекты альбомов с заглушками
      const albums = albumIds.map(id => ({
        id,
        title: `Альбом ${id}`,
        description: null,
        coverUrl: null,
      }));
      
      res.json(albums);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении альбомов" });
    }
  });
  
  app.post("/api/albums", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      // Поскольку нет прямого метода для создания альбома, 
      // мы создаем медиа-элемент с типом "album"
      const mediaItem = await storage.createMedia({
        title: req.body.title,
        type: "album",
        url: req.body.coverUrl || "",
        description: req.body.description || null,
      });
      
      // Возвращаем созданный "альбом"
      const album = {
        id: mediaItem.id,
        title: mediaItem.title,
        description: mediaItem.description || null,
        coverUrl: mediaItem.url,
      };
      
      res.status(201).json(album);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при создании альбома" });
    }
  });
  
  // Media
  app.get("/api/media", async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const mediaItems = await storage.getMedia(type, limit);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении медиа-файлов" });
    }
  });
  
  app.get("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mediaItem = await storage.getMediaById(id);
      
      if (!mediaItem) {
        return res.status(404).json({ error: "Медиа-файл не найден" });
      }
      
      res.json(mediaItem);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении медиа-файла" });
    }
  });
  
  app.post("/api/media", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      // Добавим текущую дату в случае, если она не была указана
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const requestData = {
        ...req.body,
        date: req.body.date || currentDate,
        uploadDate: req.body.uploadDate || currentDate
      };
      
      const validatedData = insertMediaSchema.parse(requestData);
      const mediaItem = await storage.createMedia(validatedData);
      res.status(201).json(mediaItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ error: error.errors });
      }
      console.error("Media creation error:", error);
      res.status(500).json({ error: "Ошибка при создании медиа-файла" });
    }
  });
  
  app.put("/api/media/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertMediaSchema.partial().parse(req.body);
      const mediaItem = await storage.updateMedia(id, validatedData);
      
      if (!mediaItem) {
        return res.status(404).json({ error: "Медиа-файл не найден" });
      }
      
      res.json(mediaItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при обновлении медиа-файла" });
    }
  });
  
  app.delete("/api/media/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteMedia(id);
      
      if (!success) {
        return res.status(404).json({ error: "Медиа-файл не найден" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Ошибка при удалении медиа-файла" });
    }
  });
  
  // Standings
  app.get("/api/standings", async (req, res) => {
    try {
      const standings = await storage.getStandings();
      res.json(standings);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении турнирной таблицы" });
    }
  });
  
  app.post("/api/standings", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const validatedData = insertStandingSchema.parse(req.body);
      const standing = await storage.createStanding(validatedData);
      res.status(201).json(standing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при создании записи в турнирной таблице" });
    }
  });
  
  app.put("/api/standings/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertStandingSchema.partial().parse(req.body);
      const standing = await storage.updateStanding(id, validatedData);
      
      if (!standing) {
        return res.status(404).json({ error: "Запись в турнирной таблице не найдена" });
      }
      
      res.json(standing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при обновлении записи в турнирной таблице" });
    }
  });
  
  app.delete("/api/standings/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      
      // Так как нет прямого метода для удаления записи из таблицы,
      // пометим запись как удаленную, обновив ее значения
      const update = {
        team: "Удалено",
        position: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      };
      
      const standing = await storage.updateStanding(id, update);
      
      if (!standing) {
        return res.status(404).json({ error: "Запись в турнирной таблице не найдена" });
      }
      
      res.status(200).json({ success: true, message: "Запись успешно удалена" });
    } catch (error) {
      console.error("Standings delete error:", error);
      res.status(500).json({ error: "Ошибка при удалении записи в турнирной таблице" });
    }
  });
  
  // Contact messages
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse({
        ...req.body,
        date: format(new Date(), "yyyy-MM-dd"),
      });
      
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json({ success: true, message: "Сообщение успешно отправлено", data: message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ error: error.errors });
      }
      console.error("Contact message error:", error);
      res.status(500).json({ error: "Ошибка при отправке сообщения" });
    }
  });
  
  app.get("/api/contact", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении сообщений" });
    }
  });
  
  app.get("/api/contact/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const message = await storage.getContactMessageById(id);
      
      if (!message) {
        return res.status(404).json({ error: "Сообщение не найдено" });
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении сообщения" });
    }
  });
  
  app.put("/api/contact/:id/read", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const message = await storage.markContactMessageAsRead(id);
      
      if (!message) {
        return res.status(404).json({ error: "Сообщение не найдено" });
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при обновлении статуса сообщения" });
    }
  });
  
  app.delete("/api/contact/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteContactMessage(id);
      
      if (!success) {
        return res.status(404).json({ error: "Сообщение не найдено" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Ошибка при удалении сообщения" });
    }
  });
  
  // Club History
  app.get("/api/history", async (req, res) => {
    try {
      const historyItems = await storage.getHistory();
      res.json(historyItems);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении истории клуба" });
    }
  });
  
  app.get("/api/history/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const historyItem = await storage.getHistoryById(id);
      
      if (!historyItem) {
        return res.status(404).json({ error: "Запись истории не найдена" });
      }
      
      res.json(historyItem);
    } catch (error) {
      res.status(500).json({ error: "Ошибка при получении записи истории" });
    }
  });
  
  app.post("/api/history", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const validatedData = insertHistorySchema.parse(req.body);
      const historyItem = await storage.createHistory(validatedData);
      res.status(201).json(historyItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при создании записи истории" });
    }
  });
  
  app.put("/api/history/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertHistorySchema.partial().parse(req.body);
      const historyItem = await storage.updateHistory(id, validatedData);
      
      if (!historyItem) {
        return res.status(404).json({ error: "Запись истории не найдена" });
      }
      
      res.json(historyItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Ошибка при обновлении записи истории" });
    }
  });
  
  app.delete("/api/history/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteHistory(id);
      
      if (!success) {
        return res.status(404).json({ error: "Запись истории не найдена" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Ошибка при удалении записи истории" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
