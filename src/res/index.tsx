import { Units } from "../core/unit/res";
import { config } from "./config";
import { res } from "../lib/mirage-x/res";

res({ outputPath: __dirname, ...config }, Units);
