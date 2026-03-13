/**
 * Input sanitization and validation utilities
 * Prevents XSS attacks and invalid data from reaching the database
 */

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

/**
 * Sanitize string input by removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove HTML special chars
    .substring(0, 10000); // Limit length
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeString(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized.toLowerCase() : '';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate MongoDB ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-f]{24}$/i.test(id);
}

/**
 * Sanitize JSON string (prevent injection)
 */
export function sanitizeJson(input: JsonValue): JsonValue {
  if (typeof input === 'string') {
    return sanitizeString(input);
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeJson);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: { [key: string]: JsonValue } = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const objectInput = input as { [key: string]: JsonValue };
        sanitized[sanitizeString(key)] = sanitizeJson(objectInput[key]);
      }
    }
    return sanitized;
  }
  return input;
}

/**
 * Validate file extension
 */
export function isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? allowedExtensions.includes(ext) : false;
}

/**
 * Validate file type (MIME type)
 */
export function isValidFileType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType);
}

/**
 * Rate limit check - validate string doesn't exceed limit
 */
export function exceedsLengthLimit(input: string, limit: number): boolean {
  return input.length > limit;
}
