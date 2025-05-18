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
exports.ParticipantController = void 0;
const participantsService_1 = __importDefault(require("../services/participantsService"));
const participant_1 = require("../models/participant");
const validationUtils_1 = require("../utils/validationUtils");
/**
 * @swagger
 * tags:
 *   name: Participants
 *   description: Endpoints for managing participants
 */
class ParticipantController {
    /**
     * @swagger
     * /admin/api/participant:
     *   post:
     *     summary: Create a new participant
     *     tags: [Participants]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [teamName, captainEmail, firstMember, secondMember, competitionId]
     *             properties:
     *               teamName:
     *                 type: string
     *                 description: Name of the team
     *               captainEmail:
     *                 type: string
     *                 description: Email address of the team captain
     *                 format: email
     *               firstMember:
     *                 type: string
     *                 description: Name of the first team member
     *               secondMember:
     *                 type: string
     *                 description: Name of the second team member
     *               competitionId:
     *                 type: integer
     *                 description: ID of the competition
     *     responses:
     *       201:
     *         description: Participant successfully created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 participant:
     *                   $ref: '#/components/schemas/Participant'
     *       400:
     *         description: Bad request - invalid input data
     *       500:
     *         description: Internal server error
     */
    static createParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { teamName, captainEmail, firstMember, secondMember, competitionId } = req.body;
                if (!teamName || !captainEmail || !firstMember || !secondMember || !competitionId) {
                    return res.status(400).json({
                        message: "all fields are required"
                    });
                }
                //validate email and password
                if (!(0, validationUtils_1.ValidateEmail)(captainEmail)) {
                    return res.status(400).json({
                        error: "invalid email address",
                        details: "please use a valid address"
                    });
                }
                const participant = new participant_1.Participant(0, teamName, captainEmail, firstMember, secondMember, competitionId);
                const createdParticipant = yield participantsService_1.default.create(participant);
                res.status(201).json({
                    message: "new participant created",
                    participant: createdParticipant.toJSON(),
                });
            }
            catch (error) {
                console.error("error creating participant: ", error);
                res.status(500).json({
                    message: "internal server error"
                });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/participant:
     *   get:
     *     summary: Get all participants
     *     tags: [Participants]
     *     responses:
     *       200:
     *         description: List of participants retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 participant:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Participant'
     *       500:
     *         description: Internal server error
     */
    static getParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const participant = yield participantsService_1.default.findAll();
                res.status(200).json({
                    message: "Participant retrived successfully",
                    participant: participant.map((participant) => participant.toJSON()),
                });
            }
            catch (error) {
                console.error("Error fetching participant: ", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/participant/competition:
     *   get:
     *     summary: Get all competitions
     *     tags: [Participants]
     *     responses:
     *       200:
     *         description: List of competitions retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 competitions:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                       name:
     *                         type: string
     *       500:
     *         description: Internal server error
     */
    static getCompetitionName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const competitions = yield participantsService_1.default.getAllCompetitions();
                res.status(200).json({ competitions });
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching competitions" });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/participant/total:
     *   get:
     *     summary: Get the total count of participants
     *     tags: [Participants]
     *     responses:
     *       200:
     *         description: Total number of participants retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 total:
     *                   type: integer
     *                   description: Total number of participants
     *       500:
     *         description: Internal server error
     */
    static countTotalParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield participantsService_1.default.countAllParticipant();
                res.status(200).json({
                    message: "Successfully count the participant",
                    total: total
                });
            }
            catch (error) {
                console.error("Error when count competition: ", error);
                res.status(500).json({
                    message: "Initial server error"
                });
            }
        });
    }
    /**
     * @swagger
     * /admin/api/participant/{id}:
     *   put:
     *     summary: Update a participant by ID
     *     tags: [Participants]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Participant ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [teamName, captainEmail, firstMember, secondMember, competitionId]
     *             properties:
     *               teamName:
     *                 type: string
     *                 description: Name of the team
     *               captainEmail:
     *                 type: string
     *                 description: Email address of the team captain
     *                 format: email
     *               firstMember:
     *                 type: string
     *                 description: Name of the first team member
     *               secondMember:
     *                 type: string
     *                 description: Name of the second team member
     *               competitionId:
     *                 type: integer
     *                 description: ID of the competition
     *     responses:
     *       200:
     *         description: Participant updated successfully
     *       400:
     *         description: Missing required fields or invalid ID
     *       404:
     *         description: Participant not found
     *       500:
     *         description: Internal server error
     */
    static updateParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                let { teamName, captainEmail, firstMember, secondMember, competitionId } = req.body;
                if (!id) {
                    return res.status(400).json({ message: "ID is required" });
                }
                ;
                if (!teamName || !captainEmail || !firstMember || !secondMember || !competitionId) {
                    res.status(400).json({
                        message: "All fields are required"
                    });
                }
                const participant = yield participantsService_1.default.findById(Number(id));
                if (!participant) {
                    return res.status(404).json({ message: "Participant not found" });
                }
                ;
                const updateParticipant = new participant_1.Participant(participant.participant_id, teamName, captainEmail, firstMember, secondMember, competitionId);
                yield participantsService_1.default.update(updateParticipant);
                res.status(200).json({
                    message: "Success updated participant",
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
     * /admin/api/participant/{id}:
     *   delete:
     *     summary: Delete a participant by ID
     *     tags: [Participants]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the participant to delete
     *     responses:
     *       200:
     *         description: Participant deleted successfully
     *       400:
     *         description: ID is required
     *       404:
     *         description: Participant not found
     *       500:
     *         description: Internal server error
     */
    static deleteParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({
                        message: "ID is required"
                    });
                }
                const participant = yield participantsService_1.default.findById(Number(id));
                if (!participant) {
                    res.status(404).json({
                        message: "Participant not found"
                    });
                }
                yield participantsService_1.default.delete(Number(id));
                return res.status(200).json({
                    message: "Participant deleted successfully"
                });
            }
            catch (error) {
                console.error("Error deleteing competetion: ", error);
                res.status(500).json({
                    message: 'Initial Server Error'
                });
            }
        });
    }
}
exports.ParticipantController = ParticipantController;
