import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import fs from "fs";
import { Octokit } from "@octokit/rest"


const app = express();
app.use(cors());
app.use(express.json());


const octokit = new Octokit({
    auth: 'GITHUB_TOKEN'
})


app.post("/getRepo", async (req,res) => {
    const {username} = req.body;
    const repo = await octokit.repos.listForUser({
        username
    })
    const repoData = repo.data.map(repo => ({
        htmlUrl: repo.html_url,
        name: repo.name
    }));

    console.log("User Repositories URLs:", repoData);
    if(repoData) {
        res.status(200).json({repoData});
    } else {
        res.status(500).json({mg:"err"});
    }

})



app.post("/clone", async (req,res) => {
    const {repoUrl,repoName} = req.body;
    await simpleGit().clone(repoUrl,`./new/${repoName}`)
  
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


// app.post("/push", async (req,res) => {
//     const {repoUrl, message} = req.body;

//     await simpleGit().add("./*");
//     await simpleGit().commit(message)
// })


app.listen(3000,() => {
    console.log("start");
})