import Cache from "file-system-cache";
import { join } from "path";

const globalCache = Cache({
  basePath: join(__dirname, "../cache"),
});

export const getCache = () => {
  return globalCache
}
