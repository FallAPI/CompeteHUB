"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Competitions = void 0;
class Competitions {
    constructor(id_competition, name, description, startDate, endDate, createdAt, updatedAt) {
        this.id_competition = id_competition;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    toJSON() {
        return {
            id_competition: this.id_competition,
            name: this.name,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    static fromJSON(json) {
        return new Competitions(json.id_competition, json.name, json.description, new Date(json.start_date), new Date(json.end_date), json.created_at ? new Date(json.created_at) : undefined, json.updated_at ? new Date(json.updated_at) : undefined);
    }
}
exports.Competitions = Competitions;
