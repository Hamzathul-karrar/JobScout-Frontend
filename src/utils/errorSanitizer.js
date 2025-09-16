// Utility function to filter out internal/technical error messages
export const sanitizeErrorMessage = (message) => {
    if (!message || typeof message !== 'string') {
      return "Registration failed. Please try again.";
    }
  
    // Check for patterns that indicate internal/technical errors
    const internalErrorPatterns = [
      /com\.hamza\.JobScout/i,           // Package names
      /java\./i,                        // Java package references
      /org\.springframework/i,          // Spring framework errors
      /org\.hibernate/i,                // Hibernate errors
      /SQLException/i,                  // Database errors
      /NullPointerException/i,          // Java exceptions
      /RuntimeException/i,              // Runtime exceptions
      /IllegalArgumentException/i,      // Specific exceptions (when exposed)
      /at\s+[a-zA-Z0-9_.]+\(/i,        // Stack trace lines
      /Caused by:/i,                    // Exception cause chains
      /\.java:\d+/i,                    // File references with line numbers
      /\$\$EnhancerBySpringCGLIB/i,     // Spring proxy classes
      /HikariPool/i,                    // Connection pool errors
      /JdbcTemplate/i,                  // JDBC errors
    ];
  
    // Check if the message contains any internal error patterns
    const hasInternalError = internalErrorPatterns.some(pattern => pattern.test(message));
    
    if (hasInternalError) {
      return "Registration failed. Please check your information and try again.";
    }
  
    // Return the original message if it's safe to display
    return message;
  };
  