import { readFile, existsSync } from 'fs'
import Serverless from 'serverless'

export const getValueFromEnv = (key: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!existsSync('.env')) {
      resolve()
      return
    }

    readFile(
      '.env',
      { encoding: 'utf-8' },
      (err: NodeJS.ErrnoException | null, data: string) => {
        if (err) {
          reject(err)
          return
        }

        const values = data
          .trim()
          .split('\n')
          .map(line => line.split(/=(.*)/))
          .reduce<Record<string, string>>(
            (accumulation, [key, value]) => ({
              ...accumulation,
              [key]: value,
            }),
            {},
          )

        resolve(values[key])
      }
    )
  })

  export const getValueFromOptions = (keys: Array<string>, opts: Serverless.Options): Array<string> | null => {
    let res: Array<string> = [];

    for (const key of keys) {
      if (!key || !key.match(/opt:/g)) {
        return null;
      }

      console.log("KEY: ", key.split(/opt:((\w+-?)*)/g))
      const optName = key.split(/opt:((\w+-?)*)/g)[1];

      if (!optName)
        continue;

      Object.keys(opts).some((opt) => {
        if (opt === optName) {
          res.push((opts as any)[opt]); // return back the found value

          const fallbackValue = key.split(',')[1]?.split('\'')[1]?.split('\'')[0];
          if (fallbackValue) {
            res.push(fallbackValue);
          }
          return;  
        }
      })
    }
    
    return res;
}
