import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Competition Management API",
      version: "1.0.0",
      description: "API for managing competitions and participants",
    },
    servers: [
      {
        url: "https://competehub-website.et.r.appspot.com",
        description: "Production server",
      },
      {
        url: "http://localhost:4000",
        description: "Development server",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Admin: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the admin"
            },
            email: {
              type: "string",
              format: "email",
              description: "Admin email address"
            },
            password: {
              type: "string",
              description: "Admin password"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp"
            },
          }
        },
        Competition: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the competition"
            },
            name: {
              type: "string",
              description: "Title of the competition"
            },
            description: {
              type: "string",
              description: "Detailed description of the competition"
            },
            startDate: {
              type: "string",
              format: "date-time",
              description: "Start date and time of the competition"
            },
            endDate: {
              type: "string",
              format: "date-time",
              description: "End date and time of the competition"
            },
          }
        },
        Participant: {     
          type: "object",
          properties: {
            participant_id: {
              type: "integer",
              description: "Unique identifier for the participant"
            },
            teamName: {
              type: "string",
              description: "Name of the team"
            },
            captainEmail: {
              type: "string",
              format: "email",
              description: "Email address of the team captain"
            },
            firstMember: {
              type: "string",
              description: "Name of the first team member"
            },
            secondMember: {
              type: "string",
              description: "Name of the second team member"
            },
            competitionId: {
              type: "integer",
              description: "ID of the competition the participant belongs to"
            },
          },
          required: ["participant_id", "teamName", "captainEmail", "firstMember", "secondMember", "competitionId"]
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message"
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/controller/*.ts"],
};


const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  }));
};