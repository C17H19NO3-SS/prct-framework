export interface Extension {
  init(): void | Promise<void>;
}
