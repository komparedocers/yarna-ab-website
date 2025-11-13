# YARNA AB Logging System Documentation

## Overview

A comprehensive, production-ready logging system for error tracking, performance monitoring, and user interaction tracking. Built with zero external dependencies.

## Features

- ✅ **Multiple Log Levels**: DEBUG, INFO, WARN, ERROR
- ✅ **Error Tracking**: Automatic capture of unhandled errors and promise rejections
- ✅ **Performance Monitoring**: Page load metrics, function timing, long task detection
- ✅ **User Interaction Tracking**: Track clicks, form submissions, and navigation
- ✅ **Local Persistence**: Save logs to localStorage
- ✅ **Safe Error Handling**: Logging never breaks the application
- ✅ **Export Capabilities**: Download logs as JSON or CSV
- ✅ **Remote Logging Ready**: Prepared for server-side logging integration

## Quick Start

The logging system is automatically initialized when the page loads. All HTML files include:

```html
<script src="js/logger.js"></script>
<script src="js/icons.js"></script>
<script src="js/main.js"></script>
```

## Configuration

Edit `js/logger.js` to configure the logging system:

```javascript
const LogConfig = {
    enabled: true,                    // Master switch
    level: 'DEBUG',                   // DEBUG, INFO, WARN, ERROR
    includeTimestamp: true,           // Add timestamps to logs
    includeStackTrace: true,          // Include stack traces for errors
    persistToLocalStorage: true,      // Save logs to localStorage
    maxStoredLogs: 1000,             // Maximum logs to keep
    performanceMonitoring: true,      // Enable performance tracking
    userInteractionTracking: true,    // Track user interactions
    consoleOutput: true,              // Output to browser console
    remoteLogging: false,             // Enable remote logging
    remoteEndpoint: '/api/logs'       // Remote logging endpoint
};
```

## Usage

### Basic Logging

```javascript
// Log levels
logDebug('Debug message', { additionalData: 'value' });
logInfo('Info message', { userId: 123 });
logWarn('Warning message', { reason: 'validation failed' });
logError('Error message', { errorCode: 500 }, errorObject);
```

### Performance Monitoring

```javascript
// Start a timer
YarnaLogger.startTimer('DataFetch');

// ... your code ...

// End the timer
const duration = YarnaLogger.endTimer('DataFetch');
```

### Track User Interactions

```javascript
trackInteraction('button_click', 'signup-button', {
    location: 'homepage',
    timestamp: Date.now()
});
```

### Accessing the Logger

The logger is globally available:

```javascript
// Direct access
window.YarnaLogger.info('Message');

// Or use helper functions
logInfo('Message');
```

## Browser Console Commands

Access these functions directly from the browser console:

### View Logs
```javascript
// View all logs
viewLogs();

// View filtered logs
viewLogs({ level: 'ERROR' });
viewLogs({ level: 'WARN', context: 'YARNA' });
```

### Download Logs
```javascript
// Download as JSON
downloadLogs();

// Download with custom filename
downloadLogs('my-logs-2025-01-13.json');
```

### Clear Logs
```javascript
clearLogs();
```

## Log Entry Structure

Each log entry contains:

```javascript
{
    timestamp: "2025-01-13T10:30:45.123Z",
    sessionId: "session_1705145445123_abc123",
    level: "INFO",
    context: "YARNA",
    message: "User action completed",
    data: { userId: 123, action: 'submit' },
    url: "https://yarna.ab/products.html",
    userAgent: "Mozilla/5.0...",
    error: {                    // Only for errors
        message: "Network error",
        stack: "Error: Network error\n    at...",
        name: "NetworkError"
    }
}
```

## Error Tracking

The system automatically captures:

### 1. Unhandled JavaScript Errors
```javascript
// These are automatically logged
throw new Error('Something went wrong');
```

### 2. Promise Rejections
```javascript
// Automatically caught
Promise.reject('Failed operation');
```

### 3. Resource Loading Errors
```javascript
// Automatically tracked
<img src="missing-image.jpg">  // Logs a warning
```

## Performance Monitoring

### Automatic Metrics

The system automatically logs:
- DNS lookup time
- TCP connection time
- Request/response time
- DOM processing time
- Total page load time
- Memory usage (if available)

### Manual Timing

```javascript
// Wrap any code block
YarnaLogger.startTimer('ComplexOperation');

// ... your code ...

YarnaLogger.endTimer('ComplexOperation', {
    itemsProcessed: 1000,
    cacheHit: true
});
```

## Integration Examples

### Form Validation
```javascript
function validateForm(formData) {
    logDebug('Validating form', { fields: Object.keys(formData) });

    try {
        // Validation logic
        if (!formData.email) {
            logWarn('Email validation failed', { formData });
            return false;
        }

        logInfo('Form validation passed');
        return true;
    } catch (error) {
        logError('Form validation error', { formData }, error);
        return false;
    }
}
```

### API Calls
```javascript
async function fetchData(endpoint) {
    YarnaLogger.startTimer(`API_${endpoint}`);

    try {
        logInfo('API call started', { endpoint });

        const response = await fetch(endpoint);
        const data = await response.json();

        YarnaLogger.endTimer(`API_${endpoint}`);
        logInfo('API call successful', {
            endpoint,
            dataSize: JSON.stringify(data).length
        });

        return data;
    } catch (error) {
        YarnaLogger.endTimer(`API_${endpoint}`);
        logError('API call failed', { endpoint }, error);
        throw error;
    }
}
```

## Remote Logging Setup

To enable server-side logging:

1. **Enable in configuration:**
```javascript
const LogConfig = {
    remoteLogging: true,
    remoteEndpoint: 'https://your-api.com/logs'
};
```

2. **Server endpoint should accept POST requests:**
```javascript
POST /api/logs
Content-Type: application/json

{
    "timestamp": "2025-01-13T10:30:45.123Z",
    "level": "ERROR",
    "message": "Error occurred",
    ...
}
```

3. **The system uses `navigator.sendBeacon()` for non-blocking requests**

## Production Recommendations

### For Development
```javascript
const LogConfig = {
    enabled: true,
    level: 'DEBUG',
    consoleOutput: true,
    remoteLogging: false
};
```

### For Production
```javascript
const LogConfig = {
    enabled: true,
    level: 'WARN',              // Only warnings and errors
    consoleOutput: false,        // Don't clutter console
    remoteLogging: true,         // Send to server
    remoteEndpoint: 'https://your-logging-service.com/logs'
};
```

## Storage Management

Logs are stored in localStorage with a maximum limit:

```javascript
// Current storage
localStorage.getItem('yarnaLogs');

// Clear if needed
localStorage.removeItem('yarnaLogs');
```

**Note:** LocalStorage has a ~5-10MB limit. The system automatically:
- Removes oldest logs when limit is reached
- Handles storage quota errors gracefully
- Never breaks the application if storage fails

## Performance Impact

The logging system is designed to have minimal impact:

- **Async Operations**: Remote logging doesn't block the main thread
- **Debouncing**: Heavy operations are optimized
- **Try-Catch**: All logging code is wrapped to prevent failures
- **Conditional**: Logs below the configured level are skipped immediately

## Troubleshooting

### Logs Not Appearing
1. Check `LogConfig.enabled = true`
2. Check `LogConfig.level` matches your log level
3. Check browser console for errors

### localStorage Full
```javascript
// Clear old logs
clearLogs();

// Or reduce max stored logs
LogConfig.maxStoredLogs = 500;
```

### Performance Issues
```javascript
// Disable features you don't need
LogConfig.performanceMonitoring = false;
LogConfig.userInteractionTracking = false;
```

## Security Considerations

- **PII Data**: Be careful not to log sensitive user data
- **Passwords**: Never log passwords or tokens
- **LocalStorage**: Can be accessed by JavaScript on the same domain
- **Remote Logging**: Ensure HTTPS and proper authentication

## Examples from the Codebase

The logging system is integrated throughout:

- `initHeader()`: Header scroll effect logging
- `initMobileMenu()`: Menu interaction tracking
- `initROICalculator()`: Calculator operations and performance
- `initContactForm()`: Form submissions and validation
- All error handlers: Automatic error capture

## Support

For issues or questions:
- Email: developers@yarna.ab
- Documentation: This file
- Source: `js/logger.js` (extensively commented)

---

**Last Updated:** January 2025
**Version:** 1.0.0
**License:** Proprietary - YARNA AB
