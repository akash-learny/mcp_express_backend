// mcp/utils/logger.js
// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Text colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

/**
 * Connection tracking
 */
let connections = new Map(); // Map of connectionId -> { name, connectedAt, lastActivity, status }
let connectionDisplayLines = 0;

/**
 * Colored log functions - all output to stderr to avoid breaking MCP JSON
 */
export const logger = {
  // Starting message
  starting() {
    process.stderr.write(`${colors.cyan}${colors.bright}⏳ Starting the MCP server...${colors.reset}\r`);
  },
  
  clearLine() {
    process.stderr.write('\x1b[K'); // Clear to end of line
  },
  
  // Clear multiple lines
  clearLines(count) {
    for (let i = 0; i < count; i++) {
      process.stderr.write('\x1b[1A'); // Move up
      process.stderr.write('\x1b[K'); // Clear line
    }
  },
  
  // Resource registration
  resource(name) {
    console.error(`${colors.green}${colors.bright}✓${colors.reset} ${colors.cyan}Registered MCP Resource:${colors.reset} ${colors.yellow}${colors.bright}${name}${colors.reset}`);
  },
  
  // Tool registration
  tool(name) {
    console.error(`  ${colors.dim}└─${colors.reset} ${colors.magenta}${name}${colors.reset}`);
  },
  
  // Tools header
  toolsHeader() {
    console.error(`${colors.green}${colors.bright}✓${colors.reset} ${colors.cyan}Registered MCP Tools:${colors.reset}`);
  },
  
  // Server ready
  serverReady() {
    console.error(`\n${colors.green}${colors.bright}🚀 MCP Server is running and awaiting client connections...${colors.reset}\n`);
  },
  
  // Refresh connection display
  refreshConnections() {
    // Clear previous connection display
    if (connectionDisplayLines > 0) {
      this.clearLines(connectionDisplayLines);
    }
    
    // Display refresh message
    const refreshTime = new Date().toLocaleTimeString();
    console.error(`${colors.dim}🔄 Refreshing connections... (${refreshTime})${colors.reset}`);
    
    // Display connection header
    if (connections.size === 0) {
      console.error(`${colors.yellow}  No active connections${colors.reset}`);
      connectionDisplayLines = 2;
    } else {
      console.error(`${colors.cyan}${colors.bright}Active Connections (${connections.size}):${colors.reset}`);
      let lineCount = 2;
      
      connections.forEach((conn, id) => {
        // Calculate duration from connection start time
        const startTime = conn.connectedAtDate || conn.lastActivity;
        const duration = this.calculateDuration(startTime);
        const statusColor = conn.status === 'active' ? colors.green : colors.yellow;
        const statusIcon = conn.status === 'active' ? '●' : '○';
        
        console.error(
          `  ${statusColor}${statusIcon}${colors.reset} ` +
          `${colors.yellow}${colors.bright}${conn.name}${colors.reset} ` +
          `${colors.dim}(${duration})${colors.reset} ` +
          `${colors.dim}[Connected: ${conn.connectedAt}]${colors.reset}`
        );
        lineCount++;
      });
      
      connectionDisplayLines = lineCount;
    }
    console.error(''); // Empty line after connections
  },
  
  // Get connection duration
  getConnectionDuration(connectedAt) {
    // connectedAt is stored as a time string, so we need to track actual connection time
    // For now, calculate from lastActivity which is a Date object
    return 'active';
  },
  
  // Calculate duration from Date object
  calculateDuration(fromDate) {
    const now = new Date();
    const diff = Math.floor((now - fromDate) / 1000); // seconds
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ${diff % 60}s`;
    return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
  },
  
  // Add or update connection
  addConnection(connectionId, clientInfo = 'Claude AI', status = 'active') {
    const now = new Date();
    const existing = connections.get(connectionId);
    
    if (existing) {
      // Update existing connection
      existing.lastActivity = now;
      existing.status = status;
    } else {
      // New connection - store both time string and Date object
      connections.set(connectionId, {
        name: clientInfo,
        connectedAt: now.toLocaleTimeString(),
        connectedAtDate: now, // Store Date object for duration calculation
        lastActivity: now,
        status: status
      });
      
      // Show new connection message
      console.error(
        `${colors.green}${colors.bright}✓${colors.reset} ` +
        `${colors.cyan}New client connected:${colors.reset} ` +
        `${colors.yellow}${colors.bright}${clientInfo}${colors.reset} ` +
        `${colors.dim}(${now.toLocaleTimeString()})${colors.reset}`
      );
    }
    
    // Refresh display
    this.refreshConnections();
  },
  
  // Update connection activity
  updateConnectionActivity(connectionId) {
    const conn = connections.get(connectionId);
    if (conn) {
      conn.lastActivity = new Date();
      conn.status = 'active';
      this.refreshConnections();
    }
  },
  
  // Remove connection
  removeConnection(connectionId) {
    const conn = connections.get(connectionId);
    if (conn) {
      connections.delete(connectionId);
      console.error(
        `${colors.yellow}⚠${colors.reset} ` +
        `${colors.cyan}Client disconnected:${colors.reset} ` +
        `${colors.yellow}${colors.bright}${conn.name}${colors.reset}`
      );
      this.refreshConnections();
    }
  },
  
  // Get all connections
  getConnections() {
    return connections;
  },
  
  // MongoDB connection
  mongoConnected() {
    console.error(`${colors.green}${colors.bright}✓${colors.reset} ${colors.cyan}MongoDB connected${colors.reset}`);
  },
  
  // MongoDB error
  mongoError(err) {
    console.error(`${colors.red}${colors.bright}✗${colors.reset} ${colors.red}MongoDB connection error:${colors.reset} ${err.message}`);
  },
  
  // Info message
  info(message) {
    console.error(`${colors.blue}ℹ${colors.reset} ${colors.cyan}${message}${colors.reset}`);
  },
  
  // Success message
  success(message) {
    console.error(`${colors.green}${colors.bright}✓${colors.reset} ${colors.green}${message}${colors.reset}`);
  },
  
  // Error message
  error(message) {
    console.error(`${colors.red}${colors.bright}✗${colors.reset} ${colors.red}${message}${colors.reset}`);
  },
};

