import '@testing-library/jest-dom';
import React from 'react';
import { TextEncoder } from 'util';

global.React = React;

global.TextEncoder = TextEncoder;

// Mock crypto.randomUUID globally for CSP tests
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn().mockReturnValue('mock-uuid-1234'),
  },
  writable: true,
});

// Mock console.error globally
jest.spyOn(console, 'error').mockImplementation(() => null);
jest.spyOn(console, 'log').mockImplementation(() => null);
