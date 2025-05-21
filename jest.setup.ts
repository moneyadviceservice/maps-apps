import React from 'react';
import { TextEncoder } from 'util';

global.React = React;

global.TextEncoder = TextEncoder;

// Mock console.error globally
jest.spyOn(console, 'error').mockImplementation(() => null);
jest.spyOn(console, 'log').mockImplementation(() => null);
