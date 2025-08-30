// Local development - no external KV needed
// This file has been cleaned up for local-only development

const createMockClient = () => ({
  get: async <T>(key: string): Promise<T | null> => null,
  set: async (key: string, value: any): Promise<string> => 'OK',
  del: async (key: string): Promise<number> => 0,
  hgetall: async (key: string): Promise<Record<string, string>> => ({}),
  hset: async (key: string, field: string, value: any): Promise<number> => 0,
});

const kvClient = createMockClient();

export default kvClient;
