"use strict";
const util_1 = require("./util");
class ServerlessOfflineSSM {
    constructor(serverless, options) {
        var _a, _b;
        this.serverless = serverless;
        this.options = options;
        this.resolver = (name) => {
            var _a;
            const [, , key] = name.match(this.ssmResolver.regex) || [];
            if (!key) {
                // Yields "A valid SSM parameter ... could not be found."
                return Promise.resolve();
            }
            const value = (_a = this.config.ssm) === null || _a === void 0 ? void 0 : _a[key];
            const promisifiedValue = value
                ? Promise.resolve(value)
                : util_1.getValueFromEnv(key);
            if (key.startsWith('/aws/reference/secretsmanager')) {
                return promisifiedValue.then(JSON.parse).catch(() => promisifiedValue);
            }
            return promisifiedValue;
        };
        this.shouldExecute = () => {
            var _a, _b, _c;
            const regex = RegExp(/(\${*)([^}]*)(}*)/); // match a string with the format of ${***} with any number of opening and closing brackets allowed
            const unresolvedStages = this.config.stages.filter((stage) => stage.match(regex));
            console.log("Config stages: ", this.config.stages, " Stage options: ", this.options.stage, " Service provider stage: ", (_a = this.serverless.service.provider) === null || _a === void 0 ? void 0 : _a.stage);
            if (unresolvedStages) {
                console.log("Stage contains unresolved param! ", unresolvedStages);
                const resolvedStage = util_1.getValueFromOptions(unresolvedStages, this.options);
                console.log("Resolved params: ", resolvedStage);
                if (resolvedStage.includes(this.options.stage)) {
                    return true;
                }
            }
            return (_c = this.config.stages.includes(this.options.stage || ((_b = this.serverless.service.provider) === null || _b === void 0 ? void 0 : _b.stage))) !== null && _c !== void 0 ? _c : false;
        };
        /**
         * This plugin is only compatible with serverless 1.69+
         */
        this.compatible = () => {
            const { version } = this.serverless;
            this.log(`serverless-offline-ssm checking serverless version ${version}.`);
            const [major, minor] = version.split('.').map(Number);
            if (major < 1 || (major === 1 && minor < 69)) {
                throw new Error('serverless-offline-ssm plugin only works with Serverless 1.69 upwards.');
            }
        };
        this.valid = () => {
            if (!this.config.stages) {
                throw new Error('serverless-offline-ssm missing configuration stages.');
            }
        };
        this.log = serverless.cli.log.bind(serverless.cli);
        this.config = (_b = (_a = serverless.service.custom) === null || _a === void 0 ? void 0 : _a['serverless-offline-ssm']) !== null && _b !== void 0 ? _b : {};
        this.provider = 'aws';
        // check for valid configuration
        this.valid();
        // check whether this plugin should be executed
        if (this.shouldExecute()) {
            // check for compatibility
            this.compatible();
            this.ssmResolver = serverless.variables.variableResolvers
                .find(({ serviceName }) => serviceName === 'SSM');
            // override the resolver
            if (this.ssmResolver) {
                this.ssmResolver.resolver = this.resolver;
            }
        }
    }
}
module.exports = ServerlessOfflineSSM;
//# sourceMappingURL=index.js.map