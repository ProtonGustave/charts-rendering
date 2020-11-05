import {
  Page,
  ScriptTagOptions,
} from 'puppeteer';

export interface RenderOptions {
  init: InitOptions;
  charts: ChartOptions|ChartOptions[];
}

export interface InitOptions {
  width: number;
  height: number;
  cb?: (page: Page) => void;
  containerSelector?: string;
  screenshotSelector?: string;
}

export interface ChartOptions {
  file: {
    path: string;
  };
  config: any;
}

export interface Exporter {
  render: (page: Page, options: ChartOptions, initOptions: InitOptions) => Promise<void>;
  // run before all iterations
  init?: (page: Page, options: InitOptions) => Promise<void>;
}
