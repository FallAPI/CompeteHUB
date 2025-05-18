"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantController = void 0;
const participantsService_1 = __importDefault(require("../services/participantsService"));
const participant_1 = require("../models/participant");
const validationUtils_1 = require("../utils/validationUtils");
class ParticipantController {
    static async createParticipant(req, res) {
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
            const createdParticipant = await participantsService_1.default.create(participant);
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
    }
    static async getParticipant(req, res) {
        try {
            const participant = await participantsService_1.default.findAll();
            res.status(200).json({
                message: "Participant retrived successfully",
                participant: participant.map((participant) => participant.toJSON()),
            });
        }
        catch (error) {
            console.error("Error fetching participant: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async getCompetitionName(req, res) {
        try {
            const competitions = await participantsService_1.default.getAllCompetitions();
            res.status(200).json({ competitions });
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching competitions" });
        }
    }
    static async countTotalParticipant(req, res) {
        try {
            const total = await participantsService_1.default.countAllParticipant();
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
    }
    static async updateParticipant(req, res) {
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
            const participant = await participantsService_1.default.findById(Number(id));
            if (!participant) {
                return res.status(404).json({ message: "Participant not found" });
            }
            ;
            const updateParticipant = new participant_1.Participant(participant.participant_id, teamName, captainEmail, firstMember, secondMember, competitionId);
            await participantsService_1.default.update(updateParticipant);
            res.status(200).json({
                message: "Success updated participant",
            });
        }
        catch (error) {
            console.error("Error updating competetion:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async deleteParticipant(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    message: "ID is required"
                });
            }
            const participant = await participantsService_1.default.findById(Number(id));
            if (!participant) {
                res.status(404).json({
                    message: "Participant not found"
                });
            }
            await participantsService_1.default.delete(Number(id));
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
    }
}
exports.ParticipantController = ParticipantController;
