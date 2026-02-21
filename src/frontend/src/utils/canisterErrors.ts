/**
 * Extract a readable error message from canister/agent errors
 * Handles various error shapes: Error objects, strings, objects with message property
 */
export function extractErrorMessage(error: unknown): string {
  // Handle Error objects
  if (error instanceof Error) {
    // Check if the error message contains "Unauthorized" or similar patterns
    const message = error.message || 'An unknown error occurred';
    
    // Extract more specific error details from common patterns
    if (message.includes('Reject text:')) {
      const match = message.match(/Reject text:\s*(.+?)(?:\n|$)/);
      if (match) return match[1].trim();
    }
    
    return message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle objects with message property
  if (error && typeof error === 'object') {
    // Check for nested message
    if ('message' in error && typeof error.message === 'string') {
      const message = error.message;
      
      // Extract reject text if present
      if (message.includes('Reject text:')) {
        const match = message.match(/Reject text:\s*(.+?)(?:\n|$)/);
        if (match) return match[1].trim();
      }
      
      return message;
    }
    
    // Check for nested cause
    if ('cause' in error && error.cause) {
      return extractErrorMessage(error.cause);
    }
    
    // Check for error_description (common in some agent errors)
    if ('error_description' in error && typeof error.error_description === 'string') {
      return error.error_description;
    }
    
    // Try to stringify the object
    try {
      const stringified = JSON.stringify(error);
      if (stringified !== '{}') {
        return stringified;
      }
    } catch {
      // Ignore stringify errors
    }
  }
  
  return 'An unknown error occurred';
}
