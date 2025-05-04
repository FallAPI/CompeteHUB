interface ICompetitions {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

class Competitions{
    constructor(
        public id:number,
        public name:string,
        public description:string,
        public startDate:Date,
        public endDate:Date,
        public createdAt?:Date,
        public updatedAt?:Date
    )
    {}

    toJSON(){
        return{
            id: this.id,
            name: this.name,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    static fromJSON(json: any): Competitions{
        return new Competitions(
            json.id,
            json.name,
            json.description,
            new Date(json.startDate),
            new Date(json.endDate),
            json.created_at ? new Date(json.created_at) : undefined,
            json.updated_at ? new Date(json.updated_at) : undefined,
        );
    }
}

export {Competitions, ICompetitions};