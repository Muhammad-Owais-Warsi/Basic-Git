import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import fs from "fs";



const app = express();
app.use(cors());
app.use(express.json());



app.post("/clone", async (req,res) => {
    const {repoUrl,folderName} = req.body;
    await simpleGit().clone(repoUrl,`./new/${folderName}`)
    .then((success) => {
        res.status(200).json({message:success.message});
    })
    .catch((error) => {
        res.status(500).json({message:error.message});
    })
})

app.delete("/delete", async (req, res) => {
    const { folderName } = req.body;
    try {
        await fs.promises.rm(`./new/${folderName}`,{ recursive: true, force: true });
        res.status(200).json({ message: "done" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(3000,() => {
    console.log("start");
})