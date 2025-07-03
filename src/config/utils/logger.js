"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var logger = function (message) {
    console.log("[".concat(new Date().toISOString(), "] ").concat(message));
};
exports.logger = logger;
