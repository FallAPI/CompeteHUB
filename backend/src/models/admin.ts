    interface IAdmin{
        id: number;
        name: string;
        email: string;
        password: string;
        created_at: Date;
    }

    class Admin{
        constructor(
            public id: number,
            public name: string,
            public email: string,
            public password: string,
            public createdAt: Date
        )
        {}
        toJSON(){
            return{
                id: this.id,
                name: this.name,
                email: this.email,
                password: this.password,
                createdAt: this.createdAt.toISOString()
            };
        }

        static fromJSON(json: any): Admin{
            return new Admin(
                json.id,
                json.name,
                json.email,
                json.password,
                json.createdAt ? new Date(json.createdAt) : new Date()
            );
        }
}

    export {Admin, IAdmin};