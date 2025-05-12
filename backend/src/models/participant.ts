interface IParticipant {
    participant_id: number;
    teamName: string;
    captainEmails: string;
    firstMembers: string;
    secondMembers: string;
    competitionId: number; 
    createdAt: Date;
    updatedAt: Date;
};

class Participant{
    constructor(
        public participant_id: number,
        public teamName: string,
        public captainEmail: string,
        public firstMembers: string,
        public secondMembers: string,
        public competitionId: number,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}
    toJSON(){
        return{
            participant_id: this.participant_id,
            teamName: this.teamName,
            captainEmail: this.captainEmail,
            firstMembers: this.firstMembers,
            secondMembers: this.secondMembers,
            competitionId: this.competitionId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    };
    
     static fromJSON(json: any): Participant{
            return new Participant(
                json.participant_id,
                json.teamName,
                json.captainEmail,
                json.firstMembers,
                json.secondMembers,
                json.competitionId,
                json.created_at ? new Date(json.created_at) : undefined,
                json.updated_at ? new Date(json.updated_at) : undefined,
            );
    }

}
    export {Participant, IParticipant};