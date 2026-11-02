import { defineConfig, type Page } from '@playwright/test';

export type LTCapabilities = {
  browserName?: string;
  browserVersion?: string;
  'LT:Options': {
    platform: string;
    build: string;
    name: string;
    user: string | undefined;
    accessKey: string | undefined;
    network: boolean;
    video: boolean;
    console: boolean;
    tunnel: boolean;
    tunnelName: string;
    geoLocation: string;
    playwrightClientVersion?: string;
    deviceName?: string;
    platformVersion?: string;
    platformName?: string;
    isRealMobile?: boolean;
    accessibility?: boolean;
    'accessibility.wcagVersion'?: string;
    'accessibility.bestPractice'?: boolean;
    'accessibility.needsReview'?: boolean;
    queueTimeout?: number;
  };
};

export type ParsedConfig = {
  systemName: string;
  version: string;
  platformName: string;
  isMobile: boolean;
};

export type PageProvider = (page: Page) => Promise<void>;

export type Project = Exclude<
  Parameters<typeof defineConfig>[0]['projects'],
  undefined
>[number];

export type ProjectMap = Record<string, Project[]>;
