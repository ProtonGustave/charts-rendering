import { Page } from 'puppeteer';

export interface RenderOptions {
  width?: number;
  height?: number;
  file: {
    path: string;
  };
  chart: any;
}

export interface Exporter {
  render: (page: Page, options: RenderOptions) => Promise<void>;
  // run before all iterations
  init?: (page: Page, options?: RenderOptions) => Promise<void>;
}
