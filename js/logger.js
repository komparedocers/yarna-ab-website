/* ========================================
   YARNA AB - Comprehensive Logging System
   Error Tracking & Performance Monitoring
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // Configuration
    // ========================================
    const LogConfig = {
        enabled: true,
        level: 'DEBUG', // DEBUG, INFO, WARN, ERROR
        includeTimestamp: true,
        includeStackTrace: true,
        persistToLocalStorage: true,
        maxStoredLogs: 1000,
        performanceMonitoring: true,
        userInteractionTracking: true,
        consoleOutput: true,
        remoteLogging: false, // Set to true to enable remote logging
        remoteEndpoint: '/api/logs', // Configure your logging endpoint
    };

    // Log Levels
    const LogLevel = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };

    // Current log level threshold
    const currentLogLevel = LogLevel[LogConfig.level] || LogLevel.DEBUG;

    // ========================================
    // Logger Class
    // ========================================
    class Logger {
        constructor(context = 'App') {
            this.context = context;
            this.sessionId = this.generateSessionId();
            this.logs = [];
            this.performanceMarks = {};

            if (LogConfig.persistToLocalStorage) {
                this.loadPersistedLogs();
            }

            this.log('INFO', 'Logger initialized', {
                sessionId: this.sessionId,
                userAgent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                url: window.location.href
            });
        }

        generateSessionId() {
            return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        createLogEntry(level, message, data = {}, error = null) {
            const entry = {
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId,
                level: level,
                context: this.context,
                message: message,
                data: data,
                url: window.location.href,
                userAgent: navigator.userAgent
            };

            if (error) {
                entry.error = {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                };
            }

            return entry;
        }

        shouldLog(level) {
            if (!LogConfig.enabled) return false;
            return LogLevel[level] >= currentLogLevel;
        }

        log(level, message, data = {}, error = null) {
            try {
                if (!this.shouldLog(level)) return;

                const entry = this.createLogEntry(level, message, data, error);
                this.logs.push(entry);

                // Console output
                if (LogConfig.consoleOutput) {
                    this.outputToConsole(level, entry);
                }

                // Persist to localStorage
                if (LogConfig.persistToLocalStorage) {
                    this.persistLog(entry);
                }

                // Send to remote server
                if (LogConfig.remoteLogging) {
                    this.sendToRemote(entry);
                }

                // Maintain max log size
                if (this.logs.length > LogConfig.maxStoredLogs) {
                    this.logs.shift();
                }
            } catch (loggingError) {
                // Fail silently - logging should never break the app
                console.error('Logging system error:', loggingError);
            }
        }

        outputToConsole(level, entry) {
            const timestamp = LogConfig.includeTimestamp ? `[${new Date(entry.timestamp).toLocaleTimeString()}]` : '';
            const context = `[${entry.context}]`;
            const message = `${timestamp} ${context} ${entry.message}`;

            switch (level) {
                case 'DEBUG':
                    console.debug(message, entry.data, entry.error || '');
                    break;
                case 'INFO':
                    console.info(message, entry.data);
                    break;
                case 'WARN':
                    console.warn(message, entry.data, entry.error || '');
                    break;
                case 'ERROR':
                    console.error(message, entry.data, entry.error || '');
                    if (LogConfig.includeStackTrace && entry.error) {
                        console.error('Stack trace:', entry.error.stack);
                    }
                    break;
            }
        }

        persistLog(entry) {
            try {
                const storedLogs = JSON.parse(localStorage.getItem('yarnaLogs') || '[]');
                storedLogs.push(entry);

                // Keep only the last N logs
                if (storedLogs.length > LogConfig.maxStoredLogs) {
                    storedLogs.splice(0, storedLogs.length - LogConfig.maxStoredLogs);
                }

                localStorage.setItem('yarnaLogs', JSON.stringify(storedLogs));
            } catch (e) {
                // LocalStorage might be full or disabled
                console.warn('Could not persist log to localStorage:', e);
            }
        }

        loadPersistedLogs() {
            try {
                const storedLogs = JSON.parse(localStorage.getItem('yarnaLogs') || '[]');
                this.logs = storedLogs;
            } catch (e) {
                console.warn('Could not load persisted logs:', e);
            }
        }

        sendToRemote(entry) {
            try {
                // Non-blocking remote logging
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(LogConfig.remoteEndpoint, JSON.stringify(entry));
                } else {
                    fetch(LogConfig.remoteEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(entry),
                        keepalive: true
                    }).catch(err => {
                        console.warn('Remote logging failed:', err);
                    });
                }
            } catch (e) {
                // Fail silently
            }
        }

        // Public logging methods
        debug(message, data = {}) {
            this.log('DEBUG', message, data);
        }

        info(message, data = {}) {
            this.log('INFO', message, data);
        }

        warn(message, data = {}, error = null) {
            this.log('WARN', message, data, error);
        }

        error(message, data = {}, error = null) {
            this.log('ERROR', message, data, error);
        }

        // Performance monitoring
        startTimer(label) {
            if (!LogConfig.performanceMonitoring) return;

            try {
                this.performanceMarks[label] = performance.now();
                this.debug(`Timer started: ${label}`);
            } catch (e) {
                console.warn('Performance monitoring error:', e);
            }
        }

        endTimer(label, data = {}) {
            if (!LogConfig.performanceMonitoring) return;

            try {
                if (!this.performanceMarks[label]) {
                    this.warn(`Timer "${label}" was never started`);
                    return;
                }

                const duration = performance.now() - this.performanceMarks[label];
                delete this.performanceMarks[label];

                this.info(`Timer completed: ${label}`, {
                    ...data,
                    duration: `${duration.toFixed(2)}ms`
                });

                return duration;
            } catch (e) {
                console.warn('Performance monitoring error:', e);
            }
        }

        // User interaction tracking
        trackInteraction(action, element, data = {}) {
            if (!LogConfig.userInteractionTracking) return;

            try {
                this.info('User interaction', {
                    action: action,
                    element: element,
                    ...data
                });
            } catch (e) {
                console.warn('Interaction tracking error:', e);
            }
        }

        // Get all logs
        getLogs(filter = {}) {
            let filteredLogs = this.logs;

            if (filter.level) {
                filteredLogs = filteredLogs.filter(log => log.level === filter.level);
            }

            if (filter.context) {
                filteredLogs = filteredLogs.filter(log => log.context === filter.context);
            }

            if (filter.startTime) {
                filteredLogs = filteredLogs.filter(log =>
                    new Date(log.timestamp) >= new Date(filter.startTime)
                );
            }

            return filteredLogs;
        }

        // Export logs
        exportLogs(format = 'json') {
            try {
                const logs = this.getLogs();

                if (format === 'json') {
                    return JSON.stringify(logs, null, 2);
                } else if (format === 'csv') {
                    return this.logsToCSV(logs);
                }
            } catch (e) {
                this.error('Failed to export logs', {}, e);
                return null;
            }
        }

        logsToCSV(logs) {
            if (!logs.length) return '';

            const headers = ['Timestamp', 'Level', 'Context', 'Message', 'Data', 'URL'];
            const rows = logs.map(log => [
                log.timestamp,
                log.level,
                log.context,
                log.message,
                JSON.stringify(log.data),
                log.url
            ]);

            return [headers, ...rows]
                .map(row => row.map(cell => `"${cell}"`).join(','))
                .join('\n');
        }

        // Clear logs
        clearLogs() {
            try {
                this.logs = [];
                localStorage.removeItem('yarnaLogs');
                this.info('Logs cleared');
            } catch (e) {
                this.error('Failed to clear logs', {}, e);
            }
        }

        // Download logs
        downloadLogs(filename = 'yarna-logs.json') {
            try {
                const content = this.exportLogs('json');
                const blob = new Blob([content], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
                this.info('Logs downloaded', { filename });
            } catch (e) {
                this.error('Failed to download logs', { filename }, e);
            }
        }
    }

    // ========================================
    // Global Error Handler
    // ========================================
    class ErrorHandler {
        constructor(logger) {
            this.logger = logger;
            this.setupGlobalHandlers();
        }

        setupGlobalHandlers() {
            // Catch unhandled errors
            window.addEventListener('error', (event) => {
                this.logger.error('Unhandled error', {
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                }, event.error);
            });

            // Catch unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                this.logger.error('Unhandled promise rejection', {
                    reason: event.reason
                }, event.reason instanceof Error ? event.reason : new Error(event.reason));
            });

            // Catch resource loading errors
            window.addEventListener('error', (event) => {
                if (event.target !== window) {
                    this.logger.warn('Resource loading error', {
                        tagName: event.target.tagName,
                        src: event.target.src || event.target.href
                    });
                }
            }, true);
        }

        wrapFunction(fn, context = 'Function') {
            const logger = this.logger;
            return function(...args) {
                try {
                    logger.debug(`Executing: ${context}`, { args });
                    const result = fn.apply(this, args);
                    logger.debug(`Completed: ${context}`);
                    return result;
                } catch (error) {
                    logger.error(`Error in ${context}`, { args }, error);
                    throw error;
                }
            };
        }

        async wrapAsync(fn, context = 'AsyncFunction') {
            const logger = this.logger;
            try {
                logger.debug(`Executing async: ${context}`);
                const result = await fn();
                logger.debug(`Completed async: ${context}`);
                return result;
            } catch (error) {
                logger.error(`Error in async ${context}`, {}, error);
                throw error;
            }
        }
    }

    // ========================================
    // Performance Monitor
    // ========================================
    class PerformanceMonitor {
        constructor(logger) {
            this.logger = logger;
            this.setupMonitoring();
        }

        setupMonitoring() {
            if (!LogConfig.performanceMonitoring) return;

            // Log page load performance
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.logPageLoadMetrics();
                }, 0);
            });

            // Monitor long tasks
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (entry.duration > 50) {
                                this.logger.warn('Long task detected', {
                                    duration: `${entry.duration.toFixed(2)}ms`,
                                    startTime: entry.startTime
                                });
                            }
                        }
                    });
                    observer.observe({ entryTypes: ['longtask'] });
                } catch (e) {
                    // Long task API might not be supported
                }
            }
        }

        logPageLoadMetrics() {
            try {
                const perfData = performance.getEntriesByType('navigation')[0];

                if (perfData) {
                    this.logger.info('Page load metrics', {
                        dns: `${(perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2)}ms`,
                        tcp: `${(perfData.connectEnd - perfData.connectStart).toFixed(2)}ms`,
                        request: `${(perfData.responseStart - perfData.requestStart).toFixed(2)}ms`,
                        response: `${(perfData.responseEnd - perfData.responseStart).toFixed(2)}ms`,
                        domProcessing: `${(perfData.domComplete - perfData.domInteractive).toFixed(2)}ms`,
                        totalLoadTime: `${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`
                    });
                }

                // Memory usage (if available)
                if (performance.memory) {
                    this.logger.info('Memory usage', {
                        usedJSHeapSize: `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
                        totalJSHeapSize: `${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
                        limit: `${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`
                    });
                }
            } catch (e) {
                this.logger.warn('Could not log performance metrics', {}, e);
            }
        }
    }

    // ========================================
    // Initialize and Export
    // ========================================
    const logger = new Logger('YARNA');
    const errorHandler = new ErrorHandler(logger);
    const performanceMonitor = new PerformanceMonitor(logger);

    // Make logger globally available
    window.YarnaLogger = logger;
    window.YarnaErrorHandler = errorHandler;

    // Expose logging functions globally for easy access
    window.logDebug = (msg, data) => logger.debug(msg, data);
    window.logInfo = (msg, data) => logger.info(msg, data);
    window.logWarn = (msg, data, err) => logger.warn(msg, data, err);
    window.logError = (msg, data, err) => logger.error(msg, data, err);
    window.trackInteraction = (action, element, data) => logger.trackInteraction(action, element, data);

    // Export logs helper (accessible from console)
    window.downloadLogs = () => logger.downloadLogs();
    window.clearLogs = () => logger.clearLogs();
    window.viewLogs = (filter) => logger.getLogs(filter);

    logger.info('Logging system fully initialized', {
        config: LogConfig,
        features: {
            errorTracking: true,
            performanceMonitoring: LogConfig.performanceMonitoring,
            userInteractionTracking: LogConfig.userInteractionTracking,
            localStorage: LogConfig.persistToLocalStorage
        }
    });

})();
