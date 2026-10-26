import { devices } from '@playwright/test';

import { Project, ProjectMap } from './types';

export const PARALLEL_RUNNERS = 12;

export const credentials = {
  username: process.env.LT_USERNAME,
  accessKey: process.env.LT_ACCESS_KEY,
};

/**
 * Takes a list of projects, makes each project dependant on the one before it.
 * This means that tests run one by one, stopping tests sitting in queues.
 */
const makeProcedural = (arr: Project[]) =>
  arr.map((p, i) => (i === 0 ? p : { ...p, dependancies: [arr[i - 1].name] }));

export const projects = {
  desktop: [
    {
      name: 'chrome:latest:Windows 11@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
      grepInvert: /@ignoreMobile/,
    },
    {
      name: 'pw-firefox:latest:Windows 10@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1280, height: 720 },
      },
      grepInvert: /@ignoreMobile/,
    },
    {
      name: 'MicrosoftEdge:latest:Windows 11@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
      grepInvert: /@ignoreMobile/,
    },
    {
      name: 'pw-webkit:latest:MacOS Ventura@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
      grepInvert: /@ignoreMobile/,
    },
    {
      name: 'MicrosoftEdge:latest:MacOS Sequoia@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
      grepInvert: /@ignoreMobile/,
    },
    {
      name: 'pw-firefox:latest:MacOS Tahoe@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
      grepInvert: /@ignoreMobile/,
    },
    {
      name: 'chrome:latest:MacOS Ventura@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
      grepInvert: /@ignoreMobile/,
    },
  ],
  android: [
    {
      name: 'Galaxy.*:12:android@lambdatest',
      use: {
        browserName: undefined,
        isMobile: true,
      },
      grepInvert: /@ignoreMobile/,
    },
    {
      name: 'Galaxy.*:15:android@lambdatest',
      use: {
        browserName: undefined,
        isMobile: true,
      },
      grepInvert: /@ignoreMobile/,
    },
    {
      name: 'Galaxy.*:14:android@lambdatest',
      use: {
        browserName: undefined,
        isMobile: true,
      },
      grepInvert: /@ignoreMobile/,
    },
    {
      name: 'Pixel.*:15:android@lambdatest',
      use: {
        browserName: undefined,
        isMobile: true,
      },
      grepInvert: /@ignoreMobile/,
    },
  ],
  ios: [
    {
      name: 'pw-webkit:latest:MacOS Ventura@lambdatest (iPhone 12)',
      use: {
        ...devices['iPhone 12'],
        isMobile: true,
      },
      grepInvert: /@ignoreMobile/,
    },
    {
      name: 'pw-webkit:latest:MacOS Ventura@lambdatest (iPhone 15 Pro Max)',
      use: {
        ...devices['iPhone 16'],
        viewport: { width: 393, height: 852 },
        isMobile: true,
      },
      grepInvert: /@ignoreMobile/,
    },
  ],
} satisfies ProjectMap;

export const ALL_DEVICES = makeProcedural([
  ...projects.desktop,
  ...projects.android,
  ...projects.ios,
]) satisfies Project[];
