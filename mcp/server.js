// mcp/server.js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- Import Modular MCP Resources ---
import registerAssetMcp from "./assets-mcp/assetsmcp.js";
import { logger } from "./utils/logger.js";

// --- ESM Path Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Load Environment Variables ---
dotenv.config({ path: path.join(__dirname, "../.env"), quiet: true });

// Show starting message
logger.starting();

// --- Create MCP Server ---
const server = new McpServer({
  name: "mern-mcp",
  version: "1.0.0",
});

// Track registered resources and tools
const registeredResources = [];
const registeredTools = [];

// Connection tracking
let connectionCounter = 0;
const connectionId = `stdio-${Date.now()}`;
let refreshInterval;
let activityInterval;

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.mongoConnected();
  })
  .catch((err) => {
    logger.mongoError(err);
  });

// ----------------------------------------------------
// REGISTER MCP MODULES
// ----------------------------------------------------
const assetMcpInfo = registerAssetMcp(server);
if (assetMcpInfo) {
  if (assetMcpInfo.resource) {
    registeredResources.push(assetMcpInfo.resource);
  }
  if (assetMcpInfo.tools && Array.isArray(assetMcpInfo.tools)) {
    registeredTools.push(...assetMcpInfo.tools);
  }
}

// Clear the starting message line
logger.clearLine();

// Display registered resources
registeredResources.forEach((resource) => {
  logger.resource(resource);
});

// Display registered tools
if (registeredTools.length > 0) {
  logger.toolsHeader();
  registeredTools.forEach((tool) => {
    logger.tool(tool);
  });
}

// --- Start MCP Server ---
const transport = new StdioServerTransport();
server.connect(transport);

// Server ready message (connect is typically synchronous for stdio)
// Use setTimeout to ensure everything is initialized
setTimeout(() => {
  logger.serverReady();
  
  // Track initial connection (MCP stdio doesn't expose IP, but we can log when ready)
  // The server is ready to accept connections via stdio
  logger.addConnection(connectionId, "Claude AI (via stdio)", 'active');
  
  // Track request activity to update connection status
  // Wrap the server's internal request handling if possible
  // Note: MCP SDK uses stdio, so we track when server is ready as "connected"
  let requestCount = 0;
  
  // Set up periodic connection refresh (every 10 seconds for better responsiveness)
  refreshInterval = setInterval(() => {
    const connections = logger.getConnections();
    if (connections.size > 0) {
      logger.refreshConnections();
    }
  }, 10000);
  
  // Update connection activity periodically to show it's alive
  activityInterval = setInterval(() => {
    logger.updateConnectionActivity(connectionId);
  }, 15000); // Update every 15 seconds
  
}, 100);

// Handle server errors
server.onerror = (error) => {
  logger.error(`Server error: ${error.message}`);
};

// Consolidated shutdown handlers
const shutdown = (signal) => {
  logger.info(`Shutting down MCP server... (${signal})`);
  // Clear intervals
  if (refreshInterval) clearInterval(refreshInterval);
  if (activityInterval) clearInterval(activityInterval);
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
