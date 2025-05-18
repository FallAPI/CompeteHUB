"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompetitionsController = void 0;
const competitionsService_1 = __importDefault(require("../services/competitionsService"));
const competitions_1 = require("../models/competitions");
const luxon_1 = require("luxon");
/**
 * @swagger
 * tags:
 *   name: Competitions
 *   description: Endpoints for managing competitions
 */
class CompetitionsController {
    /**
     * @swagger
     * /admin/api/competition:
     *   post:
     *     summary: Create a new competition
     *     tags: [Competitions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [name, description, startDate, endDate]
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the competition
     *               description:
     *                 type: string
     *                 description: Detailed description of the competition
     *               startDate:
     *                 type: string
     *                 format: date-time
     *                 description: Start date and time of the competition (ISO format)
     *               endDate:
     *                 type: string
     *                 format: date-time
     *                 description: End date and time of the competition (ISO format)
     *     responses:
     *       201:
     *         description: Competition created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 competition:
     *                   $ref: '#/components/schemas/Competition'
     *       400:
     *         description: Missing required fields
     *       500:
     *         description: Internal server error
     */
    static createCompetitions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, startDate, endDate } = req.body;
                if (!name || !description || !startDate || !endDate) {
                    return res.status(400).json({
                        message: "All fields are required",
                    });
                }
                const localstartDate = luxon_1.DateTime.fromISO(startDate, {
                    "zone": "Asia/Jakarta",
                }).toJSDate();
                const localEndDate = luxon_1.DateTime.fromISO(endDate, {
                    zone: "Asia/Jakarta"
                }).toJSDate();
                const competetion = new competitions_1.Competitions(0, name, description, localstartDate, localEndDate);
                const createdCompetetion = yield competitionsService_1.default.create(competetion);
                res.status(201).json({
                    message: "Competetion created successfully",
                    competition: createdCompetetion.toJSON(),
                });
            }
            catch (error) {
                console.error("Error creating competetion:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/competition:
     *   get:
     *     summary: Get all competitions
     *     tags: [Competitions]
     *     responses:
     *       200:
     *         description: Competitions retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 competetions:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Competition'
     *       500:
     *         description: Internal server error
     */
    static getCompetetions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const competetions = yield competitionsService_1.default.findAll();
                res.status(200).json({
                    message: "Competetions retrieved successfully",
                    competetions: competetions.map((competetion) => competetion.toJSON()),
                });
            }
            catch (error) {
                console.error("Error fetching competetions:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/competition/{id}:
     *   get:
     *     summary: Get a competition by ID
     *     tags: [Competitions]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Competition ID
     *     responses:
     *       200:
     *         description: Competition retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 competition:
     *                   $ref: '#/components/schemas/Competition'
     *       400:
     *         description: Invalid ID or ID is required
     *       404:
     *         description: Competition not found
     *       500:
     *         description: Internal server error
     */
    static getCompetitionByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: "ID is required" });
                }
                const numericId = Number(id);
                if (isNaN(numericId)) {
                    return res.status(400).json({ message: "ID must be a valid number" });
                }
                const competition = yield competitionsService_1.default.findById(numericId);
                if (!competition) {
                    return res.status(404).json({ message: "Competition not found" });
                }
                return res.status(200).json({
                    message: "Competition retrieved successfully",
                    competition: competition.toJSON(),
                });
            }
            catch (error) {
                console.error("Error fetching competition:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/competition/{id}
     *   put:
     *     summary: Update a competition by ID
     *     tags: [Competitions]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Competition ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [name, description, startDate, endDate]
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the competition
     *               description:
     *                 type: string
     *                 description: Detailed description of the competition
     *               startDate:
     *                 type: string
     *                 format: date-time
     *                 description: Start date and time of the competition (ISO format)
     *               endDate:
     *                 type: string
     *                 format: date-time
     *                 description: End date and time of the competition (ISO format)
     *     responses:
     *       200:
     *         description: Competition updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       400:
     *         description: Missing required fields or invalid ID
     *       404:
     *         description: Competition not found
     *       500:
     *         description: Internal server error
     */
    static updateCompetetion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, description, startDate, endDate } = req.body;
                if (!id) {
                    return res.status(400).json({ message: "ID is required" });
                }
                ;
                if (!name || !description || !startDate || !endDate) {
                    return res.status(400).json({ message: "All fields are required" });
                }
                ;
                const competetion = yield competitionsService_1.default.findById(Number(id));
                if (!competetion) {
                    return res.status(404).json({ message: "Competetion not found" });
                }
                ;
                const updatedCompetetion = new competitions_1.Competitions(competetion.id_competition, name, description, new Date(startDate), new Date(endDate), competetion.updatedAt);
                yield competitionsService_1.default.update(updatedCompetetion);
                res.status(200).json({
                    message: "Success updated competetion",
                });
            }
            catch (error) {
                console.error("Error updating competetion:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/competition/total:
     *   get:
     *     summary: Count all competitions
     *     tags: [Competitions]
     *     responses:
     *       200:
     *         description: Total competitions count retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 total:
     *                   type: integer
     *                   description: Total number of competitions
     *       500:
     *         description: Internal server error
     */
    static countCompetition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield competitionsService_1.default.countCompetition();
                res.status(200).json({
                    message: "Successfully count the competition",
                    total: total
                });
            }
            catch (error) {
                console.error("Error when count competition: ", error);
                res.status(500).json({
                    message: "Internal server error"
                });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/competition/ongoing:
     *   get:
     *     summary: Count ongoing competitions
     *     tags: [Competitions]
     *     responses:
     *       200:
     *         description: Total ongoing competitions count retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 total:
     *                   type: integer
     *                   description: Total number of ongoing competitions
     *       500:
     *         description: Internal server error
     */
    static countOngoinCompetition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield competitionsService_1.default.countOngoingCompetition();
                res.status(200).json({
                    message: "Successfully count the competition",
                    total: total
                });
            }
            catch (error) {
                console.error("Error when count competition: ", error);
                res.status(500).json({
                    message: "Internal server error"
                });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/competition/finish:
     *   get:
     *     summary: Count finished competitions
     *     tags: [Competitions]
     *     responses:
     *       200:
     *         description: Total finished competitions count retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 total:
     *                   type: integer
     *                   description: Total number of finished competitions
     *       500:
     *         description: Internal server error
     */
    static countFinishedCompetition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield competitionsService_1.default.countFinishCompetition();
                res.status(200).json({
                    message: "Successfully count the competition",
                    total: total
                });
            }
            catch (error) {
                console.error("Error when count competition: ", error);
                res.status(500).json({
                    message: "Internal server error"
                });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/competition/{id}:
     *   delete:
     *     summary: Delete a competition by ID
     *     tags: [Competitions]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Competition ID
     *     responses:
     *       200:
     *         description: Competition deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       400:
     *         description: ID is required
     *       404:
     *         description: Competition not found
     *       500:
     *         description: Internal server error
     */
    static deleteCompetetion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({
                        message: "ID is required"
                    });
                }
                const competetion = yield competitionsService_1.default.findById(Number(id));
                if (!competetion) {
                    res.status(404).json({
                        message: "Competetion not found"
                    });
                }
                yield competitionsService_1.default.delete(Number(id));
                return res.status(200).json({
                    message: "Competetion deleted successfully"
                });
            }
            catch (error) {
                console.error("Error deleteing competetion: ", error);
                res.status(500).json({
                    message: 'Internal server error'
                });
            }
        });
    }
}
exports.CompetitionsController = CompetitionsController;
