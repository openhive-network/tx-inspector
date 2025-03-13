import { Buffer } from 'buffer';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      buffer: Buffer
    }
  };
});
