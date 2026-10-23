export { ConfigSchema, validateConfig };
export type { Config };

import { z } from 'zod';

import pkg from './package.json';

const ConfigSchema = z
  .object({
    publicPath: z
      .string()
      .optional()
      .describe('The public path to the wasm files and the onnx model.')
      .default(
        'https://staticimgly.com/@imgly/background-removal-data/${PACKAGE_VERSION}/dist/'
      )
      .transform((val) => {
        return val
          .replace('${PACKAGE_NAME}', pkg.name)
          .replace('${PACKAGE_VERSION}', pkg.version);
      }),
    debug: z
      .boolean()
      .default(false)
      .describe('Whether to enable debug logging.'),
    rescale: z
      .boolean()
      .default(true)
      .describe('Whether to rescale the image.'),
    device: z
      .enum(['cpu', 'gpu'])
      .default('cpu')
      .describe('The device to run the model on.'),
    proxyToWorker: z
      .boolean()
      .default(false)
      .describe('Whether to proxy inference to a web worker.'),
    fetchArgs: z
      .any()
      .default({})
      .describe('Arguments to pass to fetch when loading the model.'),
    progress: z
      .custom<(key: string, current: number, total: number) => void>(
        (value) => typeof value === 'function',
        'Expected a progress callback'
      )
      .transform((callback) => z.function({
        input: z.tuple([z.string(), z.number(), z.number()]).rest(z.unknown()),
        output: z.void()
      }).implement(callback))
      .describe('Progress callback.')
      .optional(),
    model: z
      .preprocess(
        (val) => {
          switch (val) {
            case 'large':
              return 'isnet';
            case 'small':
              return 'isnet_quint8';
            case 'medium':
              return 'isnet_fp16';
            default:
              return val;
          }
        },
        z.enum(['isnet', 'isnet_fp16', 'isnet_quint8'])
      )
      .prefault('medium'),
    output: z
      .object({
        format: z
          .enum([
            'image/png',
            'image/jpeg',
            'image/webp',
            'image/x-rgba8',
            'image/x-alpha8'
          ])
          .default('image/png'),
        quality: z.number().default(0.8)
      })
      .prefault({})
  })
  .prefault({})
  .transform((config) => {
    if (config.debug) console.log('Config:', config);
    if (config.debug && !config.progress) {
      config.progress =
        config.progress ??
        ((key, current, total) => {
          console.debug(`Downloading ${key}: ${current} of ${total}`);
        });

      if (!crossOriginIsolated) {
        if (config.debug)
          console.debug(
            'Cross-Origin-Isolated is not enabled. Performance will be degraded. Please see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer.'
          );
      }
    }

    return config;
  });

// Callers may omit fields; prefaults still run through nested validation in Zod 4.
type Config = z.input<typeof ConfigSchema>;

function validateConfig(configuration?: Config): Config {
  return ConfigSchema.parse(configuration ?? {});
}
