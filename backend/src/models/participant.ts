interface IParticipant {
    participant_id: number;
    team_name: string;
    captain_email: string;
    first_member: string;
    second_member: string;
    competition_id: number; 
    competition_name?: string; 
    createdAt: Date;
    updatedAt: Date;
};

class Participant {
    constructor(
        public participant_id: number,
        public team_name: string,
        public captain_email: string,
        public first_member: string,
        public second_member: string,
        public competition_id: number,
        public competition_name?: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}
    
    toJSON() {
        return {
            participant_id: this.participant_id,
            team_name: this.team_name,
            captain_email: this.captain_email,
            first_member: this.first_member,
            second_member: this.second_member,
            competition_id: this.competition_id,
            competition_name: this.competition_name,  // Include in output
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    };
    
    static fromJSON(json: any): Participant {
        return new Participant(
            json.participant_id,
            json.team_name,
            json.captain_email,
            json.first_member,
            json.second_member,
            json.competition_id,
            json.name || json.competition_name,  // Handle both possible field names
            json.created_at ? new Date(json.created_at) : undefined,
            json.updated_at ? new Date(json.updated_at) : undefined,
        );
    }
}
    export {Participant, IParticipant};