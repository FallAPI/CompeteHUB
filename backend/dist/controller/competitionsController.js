"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompetitionsController = void 0;
const competitionsService_1 = __importDefault(require("../services/competitionsService"));
const competitions_1 = require("../models/competitions");
const luxon_1 = require("luxon");
class CompetitionsController {
    static async createCompetetions(req, res) {
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
            const createdCompetetion = await competitionsService_1.default.create(competetion);
            res.status(201).json({
                message: "Competetion created successfully",
                competition: createdCompetetion.toJSON(),
            });
        }
        catch (error) {
            console.error("Error creating competetion:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async getCompetetions(req, res) {
        try {
            const competetions = await competitionsService_1.default.findAll();
            res.status(200).json({
                message: "Competetions retrieved successfully",
                competetions: competetions.map((competetion) => competetion.toJSON()),
            });
        }
        catch (error) {
            console.error("Error fetching competetions:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async updateCompetetion(req, res) {
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
            const competetion = await competitionsService_1.default.findById(Number(id));
            if (!competetion) {
                return res.status(404).json({ message: "Competetion not found" });
            }
            ;
            const updatedCompetetion = new competitions_1.Competitions(competetion.id_competition, name, description, new Date(startDate), new Date(endDate), competetion.createdAt);
            await competitionsService_1.default.update(updatedCompetetion);
            res.status(200).json({
                message: "Success updated competetion",
            });
        }
        catch (error) {
            console.error("Error updating competetion:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async countCompetition(req, res) {
        try {
            const total = await competitionsService_1.default.countCompetition();
            res.status(200).json({
                message: "Successfully count the competition",
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
    static async countOngoinCompetition(req, res) {
        try {
            const total = await competitionsService_1.default.countOngoingCompetition();
            res.status(200).json({
                message: "Successfully count the competition",
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
    static async countFinishedCompetition(req, res) {
        try {
            const total = await competitionsService_1.default.countFinishCompetition();
            res.status(200).json({
                message: "Successfully count the competition",
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
    static async deleteCompetetion(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    message: "ID is required"
                });
            }
            const competetion = await competitionsService_1.default.findById(Number(id));
            if (!competetion) {
                res.status(404).json({
                    message: "Competetion not found"
                });
            }
            await competitionsService_1.default.delete(Number(id));
            return res.status(200).json({
                message: "Competetion deleted successfully"
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
exports.CompetitionsController = CompetitionsController;
