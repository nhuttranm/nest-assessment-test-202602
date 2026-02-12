"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const uuid_1 = require("uuid");
describe('PairsController (e2e)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it('/POST pairs (POST)', () => {
        const id1 = (0, uuid_1.v4)();
        const id2 = (0, uuid_1.v4)();
        return (0, supertest_1.default)(app.getHttpServer())
            .post('/pairs')
            .send({ id1, id2 })
            .expect(201)
            .expect((res) => {
            expect(res.body).toHaveProperty('id1');
            expect(res.body).toHaveProperty('id2');
            expect(res.body).toHaveProperty('userID');
            expect(res.body.id1).toBe(id1);
            expect(res.body.id2).toBe(id2);
        });
    });
    afterEach(async () => {
        await app.close();
    });
});
//# sourceMappingURL=pairs.e2e-spec.js.map