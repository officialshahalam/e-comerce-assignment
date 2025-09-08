import swaggerAutogen from "swagger-autogen";
import path from "path";

const doc = {
  info: {
    title: "Auth Service Api",
    description: "Automatically generate swagger docs",
    version: "1.0.0",
  },
  host: "e-comerce-assignment.onrender.com", 
  basePath: "/api",                          
  schemes: ["https"],                        
};

const outputFile = path.resolve(process.cwd(), "swagger-output.json");
const endpointsFiles = [
  process.env.NODE_ENV === "production"
    ? "./dist/routes/auth.routes.js"
    : "./src/routes/auth.routes.ts",
];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated successfully!");
});
