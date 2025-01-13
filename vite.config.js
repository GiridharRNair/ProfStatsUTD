import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import fs from "fs";
import { resolve } from "path";

const packageFile = fs.readFileSync("package.json", "utf-8");
const { version, description } = JSON.parse(packageFile);

const MANIFEST = {
    manifest_version: 3,
    name: "ProfStats UT Dallas",
    icons: {
        16: "icon16.png",
        32: "icon32.png",
        48: "icon48.png",
        128: "icon128.png",
    },
    action: {
        default_popup: "index.html",
    },
    key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiVTEGXe9B6uvezY/ZoevozdoGvxkBGF/FUcPNgtDl+CVJ+aYKxfFYYGiJA1vJgJoUGOp/DOkZ8yWtkfjF6bSqTk5U4zNVs9AeVcW/2uX7DqWkdaUNR4YxdFizeOSANfOvJrv6SMbJU6YtLD0lszakcXsyp+EM+HUmMFkivFp7CIgB5HvUcdMqeYkpdGIqG5pbroqKo/zWwVAUIBCg1UqIcpTIBQEgMbE0K/9oGSM3x5IFNWJMsfbL4/y1+QUwzCSg6XoD3MUgbpNM78gJkKsV2BdGWcnfVYaWKIWjy9zFz48BCQvkNqby+6VWHJvzotCJsx/SwxbF2UevV09wwjqDQIDAQAB",
    version,
    description,
};

export default defineConfig({
    plugins: [react(), crx({ manifest: MANIFEST })],
    server: { port: 5173 },
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
});
