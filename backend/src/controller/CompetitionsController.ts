import { Request, Response } from "express";
import CompetetionsService from "../services/CompetitionsService";
import { Competitions } from "../models/Competitions";


export class CompetitionsController {
    static async createCompetetions(req: Request, res: Response): Promise<Response | void> {
        try{
            const {name, description, startDate, endDate} = req.body;
            
            if(!name || !description || !startDate || !endDate){
                return res.status(400).json({
                    message: "all fields are required",
                });
            }

            const date = new Date();

            const competetion = new Competitions(
                    0,
                    name,
                    description,
                    new Date(startDate),
                    new Date(endDate),
            );

            const createdCompetetion = await CompetetionsService.create(competetion);
            res.status(201).json({
                message: "Competetion created successfully",
                competetion: createdCompetetion.toJSON(),
            });

        }catch (error) {            
            console.error("Error creating competetion:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getCompetetions(req: Request, res: Response): Promise<Response | void> {
        try{
            const competetions = await CompetetionsService.findAll();
            res.status(200).json({
                message: "Competetions retrieved successfully",
                competetions: competetions.map((competetion) => competetion.toJSON()),
            })
        }catch(error) {
            console.error("Error fetching competetions:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateCompetetion(req: Request, res: Response): Promise<Response | void> {
        try {
            const {id} = req.params;
            const {name, description, startDate, endDate} = req.body;

            if(!id) {
                return res.status(400).json({ message: "ID is required" });
            };

            if(!name || !description || !startDate || !endDate) {
                return res.status(400).json({ message: "All fields are required" });
            };

            const competetion = await CompetetionsService.findById(Number(id));
            if(!competetion) {
                return res.status(404).json({ message: "Competetion not found" });
            };

            const updatedCompetetion = new Competitions(  
                    competetion.id,
                    name,
                    description,
                    new Date(startDate),
                    new Date(endDate),
                    competetion.createdAt,
                );

             const NewUpdatedCompetetion = await CompetetionsService.update(updatedCompetetion);
             res.status(200).json({
                message: "Success updated competetion",
             })
                
            
        } catch (error) {
            console.error("Error updating competetion:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async deleteCompetetion(req: Request, res: Response): Promise<Response | void> {
        try {
            const { id } = req.params;
            if(!id){
                return res.status(400).json({
                    message: "ID is required"
                });
            }

            const competetion = await CompetetionsService.findById(Number(id));
            if(!competetion){
                res.status(404).json({
                    message: "Competetion not found"
                })
            }
            
            await CompetetionsService.delete(Number(id));
            return res.status(200).json({
                message: "Competetion deleted successfully"
            })

        } catch (error) {
            console.error("Error deleteing competetion: ", error);
            res.status(500).json({
                message: 'Initial Server Error'
            })
        }
    }
}