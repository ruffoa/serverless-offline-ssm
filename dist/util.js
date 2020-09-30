"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueFromOptions = exports.getValueFromEnv = void 0;
const fs_1 = require("fs");
exports.getValueFromEnv = (key) => new Promise((resolve, reject) => {
    if (!fs_1.existsSync('.env')) {
        resolve();
        return;
    }
    fs_1.readFile('.env', { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            reject(err);
            return;
        }
        const values = data
            .trim()
            .split('\n')
            .map(line => line.split(/=(.*)/))
            .reduce((accumulation, [key, value]) => (Object.assign(Object.assign({}, accumulation), { [key]: value })), {});
        resolve(values[key]);
    });
});
exports.getValueFromOptions = (keys, opts) => {
    let res = [];
    for (const key of keys) {
        if (!key || !key.match(/opt:/g)) {
            return null;
        }
        console.log("KEY: ", key.split(/opt:((\w+-?)*)/g), opts);
        const optName = key.split(/opt:((\w+-?)*)/g)[1];
        if (!optName)
            continue;
        Object.keys(opts).some((opt) => {
            var _a, _b;
            if (opt === optName) {
                res.push(opts[opt]); // return back the found value
                const fallbackValue = (_b = (_a = key.split(',')[1]) === null || _a === void 0 ? void 0 : _a.split('\'')[1]) === null || _b === void 0 ? void 0 : _b.split('\'')[0];
                if (fallbackValue) {
                    res.push(fallbackValue);
                }
                return;
            }
        });
    }
    return res;
};
//# sourceMappingURL=util.js.map