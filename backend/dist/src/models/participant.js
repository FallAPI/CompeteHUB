"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participant = void 0;
;
class Participant {
    constructor(participant_id, team_name, captain_email, first_member, second_member, competition_id, competition_name, createdAt, updatedAt) {
        this.participant_id = participant_id;
        this.team_name = team_name;
        this.captain_email = captain_email;
        this.first_member = first_member;
        this.second_member = second_member;
        this.competition_id = competition_id;
        this.competition_name = competition_name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    toJSON() {
        return {
            participant_id: this.participant_id,
            team_name: this.team_name,
            captain_email: this.captain_email,
            first_member: this.first_member,
            second_member: this.second_member,
            competition_id: this.competition_id,
            competition_name: this.competition_name, // Include in output
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    ;
    static fromJSON(json) {
        return new Participant(json.participant_id, json.team_name, json.captain_email, json.first_member, json.second_member, json.competition_id, json.name || json.competition_name, // Handle both possible field names
        json.created_at ? new Date(json.created_at) : undefined, json.updated_at ? new Date(json.updated_at) : undefined);
    }
}
exports.Participant = Participant;
