import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter for API endpoints
 * Tracks requests by IP address with configurable limit and window
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 3, // 3 requests per window
  windowMs: 3600000, // 1 hour
};

/**
 * Get client IP from request headers
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Rate limit middleware for API routes
 * Returns 429 Too Many Requests if limit exceeded
 */
export function createRateLimitMiddleware(config: RateLimitConfig = DEFAULT_CONFIG) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const clientIp = getClientIp(request);
    const now = Date.now();

    // Clean up old entries (optional - could be done periodically)
    if (Math.random() < 0.01) {
      Object.keys(store).forEach((key) => {
        if (store[key].resetTime < now) {
          delete store[key];
        }
      });
    }

    if (!store[clientIp]) {
      store[clientIp] = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      return null; // Allow request
    }

    const record = store[clientIp];

    // Reset if window expired
    if (record.resetTime < now) {
      record.count = 1;
      record.resetTime = now + config.windowMs;
      return null; // Allow request
    }

    // Increment counter
    record.count++;

    // Check if limit exceeded
    if (record.count > config.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Maximum ${config.maxRequests} requests per ${Math.floor(config.windowMs / 1000)} seconds.`,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': record.resetTime.toString(),
          },
        }
      );
    }

    // Allow request and include rate limit headers
    return null;
  };
}

/**
 * Helper to create rate limit error response manually
 */
export function createRateLimitResponse(remaining: number, limit: number, resetTime: number) {
  const now = Date.now();
  const retryAfter = Math.ceil((resetTime - now) / 1000);

  return NextResponse.json(
    {
      error: 'Too many requests',
      message: `Rate limit exceeded. Maximum ${limit} requests per hour.`,
      retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
      },
    }
  );
}
