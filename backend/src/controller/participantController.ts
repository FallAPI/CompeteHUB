import { Request, Response } from "express";
import participantService from "../services/participantsService";
import { Participant, IParticipant} from "../models/participant";
import { ValidateEmail } from "../utils/validationUtils";

export class ParticipantController{
    static async createParticipant(req: Request, res: Response): Promise<Response | void>{
        try {
            const {teamName, captainEmail, firstMember, secondMember, competitionId} = req.body;
            
        if(!teamName || !captainEmail || !firstMember || !secondMember || !competitionId){
            return res.status(400).json({
                message: "all fields are required"
            });
        }
            //validate email and password
            if(!ValidateEmail(captainEmail)){
                return res.status(400).json({
                    error: "invalid email address",
                    details: "please use a valid address"
                });
                
            }

            const participant = new Participant(
                0,
                teamName,
                captainEmail, 
                firstMember,
                secondMember,
                competitionId
            );

            const createdParticipant = await participantService.create(participant);
            res.status(201).json({
                message: "new participant created",
                participant: createdParticipant.toJSON(),
            });

        } catch (error) {
            console.error("error creating participant: ", error);
            res.status(500).json({
                message: "internal server error"
            });
        }
    }

    static async getParticipant(req: Request, res: Response): Promise<Response | void>{
        try {
            const participant = await participantService.findAll();

            res.status(200).json({
                message: "Participant retrived successfully",
                participant: participant.map((participant) => participant.toJSON()),
            });
        } catch (error) {
            console.error("Error fetching participant: ", error);
            res.status(500).json({message: "Internal server error"});          
        }
    }

    static async getCompetitionName(req: Request, res: Response): Promise<void>{
        try {
            const competitions = await participantService.getAllCompetitions();
            res.status(200).json({competitions});
        } catch (error) {
            res.status(500).json({ message: "Error fetching competitions" });
        }
    }

    static async updateParticipant(req: Request, res: Response): Promise<Response | void>{
        try {
            const {id} = req.params;
            let {teamName, captainEmail, firstMember, secondMember, competitionId} = req.body;


            if(!id){
                return res.status(400).json({message: "ID is required"});
            };

            if(!teamName || !captainEmail || !firstMember || !secondMember || !competitionId){
                res.status(400).json({
                    message: "All fields are required"
                });
            }

            const participant = await participantService.findById(Number(id));
            if(!participant){
                return res.status(404).json({ message: "Participant not found" });
            };

            const updateParticipant = new Participant(
                participant.participant_id,
                teamName,
                captainEmail,
                firstMember,
                secondMember,
                competitionId
            );

            await participantService.update(updateParticipant);
            res.status(200).json({
                message: "Success updated participant",
            });
        } catch (error) {
            console.error("Error updating competetion:", error);
            res.status(500).json({ message: "Internal server error" });
        }
            
    }

    static async deleteParticipant(req: Request, res: Response): Promise<Response | void>{
        try {
            const {id} = req.params;

            if(!id){
                return res.status(400).json({
                    message: "ID is required"
                });
            }

            const participant = await participantService.findById(Number(id))
            if(!participant){
                res.status(404).json({
                    message: "Participant not found"
                });
            }

            await participantService.delete(Number(id));
            return res.status(200).json({
                message: "Participant deleted successfully"
            })
        } catch (error) {
            console.error("Error deleteing competetion: ", error);
            res.status(500).json({
                message: 'Initial Server Error'
            })
        }
    }
}