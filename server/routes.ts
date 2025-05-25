import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all policies
  app.get("/api/policies", async (req, res) => {
    try {
      const policies = await storage.getAllPolicies();
      res.json(policies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch policies" });
    }
  });

  // Get specific policy by type
  app.get("/api/policies/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const policy = await storage.getPolicyByType(type);
      
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      res.json(policy);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch policy" });
    }
  });

  // Search within policies
  app.get("/api/policies/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const policies = await storage.getAllPolicies();
      
      const searchResults = policies.map(policy => {
        const content = policy.content.toLowerCase();
        const searchTerm = query.toLowerCase();
        
        if (content.includes(searchTerm)) {
          // Find context around the search term
          const index = content.indexOf(searchTerm);
          const start = Math.max(0, index - 100);
          const end = Math.min(content.length, index + searchTerm.length + 100);
          const context = policy.content.substring(start, end);
          
          return {
            policy: {
              type: policy.type,
              title: policy.title,
              icon: policy.icon
            },
            context: context,
            matches: (content.match(new RegExp(searchTerm, 'g')) || []).length
          };
        }
        return null;
      }).filter(Boolean);
      
      res.json(searchResults);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
