import { evaluateRegex } from '../lib/regexEvaluation';
self.onmessage = (event: MessageEvent<{pattern: string; flags: string; text: string}>) => {
  self.postMessage(evaluateRegex(event.data.pattern, event.data.flags, event.data.text));
};
