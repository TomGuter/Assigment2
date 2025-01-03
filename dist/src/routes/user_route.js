"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_auth_1 = __importDefault(require("../controllers/user_controller_auth"));
router.post("/register", (req, res) => {
    user_controller_auth_1.default.register(req, res);
});
router.post("/login", user_controller_auth_1.default.login);
router.post("/logout", user_controller_auth_1.default.logout);
router.post("/refresh", user_controller_auth_1.default.refresh);
exports.default = router;
//# sourceMappingURL=user_route.js.map