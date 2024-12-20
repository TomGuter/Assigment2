import moduleApp from "./server";

const port = process.env.PORT

const startServer = async () => {
  try {
    const app = await moduleApp();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();