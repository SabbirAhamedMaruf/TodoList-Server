const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());
require("dotenv").config();

// Mongodb URI (MongoDB Cred)
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pzharqa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Database and collection
    const database = client.db("Todolist");
    const todoCollection = database.collection("todos");

    // API
    // ! GET APIS
    // getting all todos
    app.get("/gettodo", async (req, res) => {
      const todosData = await todoCollection.find().toArray();
      res.send(todosData);
    });
    // getting todos data by pagination
    app.get("/gettodobypagination", async (req, res) => {
      const currentPage = req.query.currentPage;
      const priority = req.query.priority;
      if (priority === "none") {
        const todosData = await todoCollection.find().toArray();
        res.send(todosData);
      } else {
        const query = { priority: priority };
        const todosData = await todoCollection
          .find(query)
          .skip(parseInt(currentPage))
          .limit(10)
          .toArray();
        res.send(todosData);
      }
    });

    // ! POST APIS
    // adding todo
    app.post("/addtodo", async (req, res) => {
      const currentTodoData = req.body;
      const result = await todoCollection.insertOne(currentTodoData);
      res.send(result);
    });

    // ! DELETE APIS
    app.delete("/deletetodo", async (req, res) => {
      const currentTodoId = req.query.id;
      const query = { _id: new ObjectId(currentTodoId)};
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });




    // ! Loging mongodb connection
    console.log("Log: Connection established with database!");
  } finally {
  }
}
run().catch(console.dir);

// Server config
app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.listen(port, () => {
  console.log("Log: Server is running on port", port);
});
