import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import path from "path";
/** Absolute path to the bundled cache config directory. */
const configPath = path.resolve(__dirname, "config");
/** Pattern matching JavaScript and TypeScript config files. */
const regex = /\.(m?js|ts)$/;
/** Config files discovered in the bundled config directory, excluding declaration files. */
const configs = Array.from(new Bun.Glob("**/*").scanSync({
    cwd: configPath
})).filter((value) => regex.test(value) && !value.endsWith(".d.ts"));
/** Copies each bundled cache config file into the app config directory. */
for (const config of configs) {
    const destination = config.replace(regex, ".ts");
    await Bun.write(App.Path.configPath(destination), await Bun.file(path.resolve(configPath, config)).text());
    Logger.setContext("CONFIGURE").info(`Copying ${config} into config/${destination}`);
}
