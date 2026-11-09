export interface ChangelogGeneratorSchema {
  project: string;
  releaseVersion: string;
  from?: string;
  preview?: boolean;
  commit?: boolean;
}
