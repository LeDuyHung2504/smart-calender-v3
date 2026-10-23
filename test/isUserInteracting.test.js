import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('isUserInteracting Anti-Race Condition and Sync Polling Suspension Suite', () => {
  let isUserInteracting = false;
  let listeners = {};
  let mockWindow;
  let mockDocument;
  let pullFromGCalMock;
  let syncIntervalId;
  const SYNC_INTERVAL_MS = 60000;

  beforeEach(() => {
    vi.useFakeTimers();
    isUserInteracting = false;
    listeners = {};

    // Create mocked Document & Window objects
    mockDocument = {
      addEventListener: vi.fn((event, handler) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
      removeEventListener: vi.fn((event, handler) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter(h => h !== handler);
        }
      }),
      dispatchEvent: vi.fn((event) => {
        const type = typeof event === 'string' ? event : event.type;
        const handlers = listeners[type] || [];
        handlers.forEach(h => h(event));
      })
    };

    mockWindow = {
      document: mockDocument,
      addEventListener: mockDocument.addEventListener,
      removeEventListener: mockDocument.removeEventListener,
      dispatchEvent: mockDocument.dispatchEvent
    };

    // Register interaction listeners matching ChronoFlow implementation
    const startInteracting = () => {
      isUserInteracting = true;
    };
    const stopInteracting = () => {
      isUserInteracting = false;
    };

    mockDocument.addEventListener('mousedown', startInteracting);
    mockDocument.addEventListener('touchstart', startInteracting);
    mockDocument.addEventListener('dragstart', startInteracting);

    mockDocument.addEventListener('mouseup', stopInteracting);
    mockDocument.addEventListener('touchend', stopInteracting);
    mockDocument.addEventListener('drop', stopInteracting);
    mockDocument.addEventListener('dragend', stopInteracting);

    // Mock the Google Calendar pull function
    pullFromGCalMock = vi.fn().mockImplementation((manual = false) => {
      if (!manual && isUserInteracting) {
        return { success: false, skipped: true, reason: 'user_interacting_or_busy' };
      }
      return { success: true, count: 0 };
    });

    // Setup the mock sync polling setInterval
    syncIntervalId = setInterval(() => {
      if (!isUserInteracting) {
        pullFromGCalMock(false);
      }
    }, SYNC_INTERVAL_MS);
  });

  afterEach(() => {
    clearInterval(syncIntervalId);
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with isUserInteracting as false and allow sync polling', () => {
    expect(isUserInteracting).toBe(false);

    // Advance by 1 interval
    vi.advanceTimersByTime(SYNC_INTERVAL_MS);
    expect(pullFromGCalMock).toHaveBeenCalledTimes(1);

    // Advance by another interval
    vi.advanceTimersByTime(SYNC_INTERVAL_MS);
    expect(pullFromGCalMock).toHaveBeenCalledTimes(2);
  });

  it('should set isUserInteracting to true on mousedown and pause setInterval sync execution', () => {
    mockDocument.dispatchEvent('mousedown');
    expect(isUserInteracting).toBe(true);

    // Fast-forward 3 sync interval cycles
    vi.advanceTimersByTime(SYNC_INTERVAL_MS * 3);
    expect(pullFromGCalMock).not.toHaveBeenCalled();

    // Release mouse
    mockDocument.dispatchEvent('mouseup');
    expect(isUserInteracting).toBe(false);

    // Next tick resumes execution
    vi.advanceTimersByTime(SYNC_INTERVAL_MS);
    expect(pullFromGCalMock).toHaveBeenCalledTimes(1);
  });

  it('should set isUserInteracting to true on touchstart and reset to false on touchend', () => {
    mockDocument.dispatchEvent('touchstart');
    expect(isUserInteracting).toBe(true);

    // Advance timer while touching screen
    vi.advanceTimersByTime(SYNC_INTERVAL_MS * 2);
    expect(pullFromGCalMock).not.toHaveBeenCalled();

    // User lifts finger
    mockDocument.dispatchEvent('touchend');
    expect(isUserInteracting).toBe(false);

    // Sync polling resumes
    vi.advanceTimersByTime(SYNC_INTERVAL_MS);
    expect(pullFromGCalMock).toHaveBeenCalledTimes(1);
  });

  it('should set isUserInteracting to true on dragstart and reset to false on drop or dragend', () => {
    mockDocument.dispatchEvent('dragstart');
    expect(isUserInteracting).toBe(true);

    // Sync polling must be suspended during active dragging
    vi.advanceTimersByTime(SYNC_INTERVAL_MS * 5);
    expect(pullFromGCalMock).not.toHaveBeenCalled();

    // User drops dragged task into slot
    mockDocument.dispatchEvent('drop');
    expect(isUserInteracting).toBe(false);

    // Sync polling resumes
    vi.advanceTimersByTime(SYNC_INTERVAL_MS);
    expect(pullFromGCalMock).toHaveBeenCalledTimes(1);

    // Test dragend safety fallback
    mockDocument.dispatchEvent('dragstart');
    expect(isUserInteracting).toBe(true);
    mockDocument.dispatchEvent('dragend');
    expect(isUserInteracting).toBe(false);
  });

  it('should allow manual sync trigger to bypass isUserInteracting pause', () => {
    mockDocument.dispatchEvent('mousedown');
    expect(isUserInteracting).toBe(true);

    // Manual sync call (e.g. user clicked "Sync Now" button)
    const result = pullFromGCalMock(true);
    expect(result).toEqual({ success: true, count: 0 });
    expect(pullFromGCalMock).toHaveBeenCalledTimes(1);

    // Automated interval tick is still paused
    vi.advanceTimersByTime(SYNC_INTERVAL_MS);
    expect(pullFromGCalMock).toHaveBeenCalledTimes(1); // Still 1 because background tick was paused
  });
});
