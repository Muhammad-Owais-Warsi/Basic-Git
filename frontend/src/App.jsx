import { useState } from 'react';
import axios from "axios";

function App() {
    const [repoUrl, setRepoUrl] = useState("");
    const [folderName, setFolderName] = useState("");
    const [cloning, setCloning] = useState(false);

    const clone = async () => {
        try {
            setCloning(true);

            await axios.post("http://localhost:3000/clone", {
                repoUrl,
                folderName
            });

            console.log("Clone successful");
        } catch (error) {
            console.error("Error during clone:", error.message);
        } finally {
            setCloning(false);
        }
    };

    return (
        <>
            Repo URL: <input type="text" onChange={(e) => setRepoUrl(e.target.value)} />
            Folder Name: <input type="text" onChange={(e) => setFolderName(e.target.value)} />
            <button onClick={clone} disabled={cloning}>
                {cloning ? "Cloning..." : "Clone"}
            </button>
        </>
    );
}

export default App;
