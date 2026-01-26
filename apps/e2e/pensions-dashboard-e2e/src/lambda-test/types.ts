export interface LTCapabilities {
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
  };
}
