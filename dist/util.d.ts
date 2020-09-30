import Serverless from 'serverless';
export declare const getValueFromEnv: (key: string) => Promise<string>;
export declare const getValueFromOptions: (keys: Array<string>, opts: Serverless.Options) => Array<string> | null;
