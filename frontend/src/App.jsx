import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loadingStates, setLoadingStates] = useState([]);
  const [repository, setRepository] = useState({ repoData: [] });
  const [username, setUsername] = useState('');

  const clone = async (index) => {
    try {
      setLoadingStates((prevStates) => {
        const newState = [...prevStates];
        newState[index] = { ...newState[index], clone: true };
        return newState;
      });

      const repoUrl = repository.repoData[index].htmlUrl;
      const repoName = repository.repoData[index].name;
      await axios.post('http://localhost:3000/clone', {
        repoUrl,
        repoName,
      });
      console.log('Clone successful');
    } catch (error) {
      console.error('Error during clone:', error.message);
    } finally {
      setLoadingStates((prevStates) => {
        const newState = [...prevStates];
        newState[index] = { ...newState[index], clone: false };
        return newState;
      });
    }
  };

  const remove = async (index) => {
    try {
      setLoadingStates((prevStates) => {
        const newState = [...prevStates];
        newState[index] = { ...newState[index], remove: true };
        return newState;
      });

      const folderName = repository.repoData[index].name;
      await axios.delete('http://localhost:3000/delete', {
        data: { folderName },
      });
      console.log('Remove successful');
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingStates((prevStates) => {
        const newState = [...prevStates];
        newState[index] = { ...newState[index], remove: false };
        return newState;
      });
    }
  };

  const getRepo = async () => {
    try {
      const repo = await axios.post('http://localhost:3000/getRepo', {
        username,
      });

      // Initialize loading states array based on the number of repositories
      setLoadingStates(Array(repo.data.repoData.length).fill({ clone: false, remove: false }));
      setRepository(repo.data);
    } catch (error) {
      console.error('Error fetching repository:', error.message);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        color: '#c9d1d9',
        backgroundColor: '#0d1117',
      }}
    >
      <label style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
        GitHub Username: 
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          style={{ backgroundColor: '#161b22', color: '#c9d1d9', padding: '8px', borderRadius: '4px' }}
        />
      </label>
      <button
        style={{
          backgroundColor: '#2ea44f',
          color: '#fff',
          padding: '10px',
          fontSize: '16px',
          cursor: 'pointer',
          border: '1px solid #2ea44f',
          borderRadius: '6px',
          marginBottom: '10px',
        }}
        onClick={getRepo}
      >
        Get Repos
      </button>

      {repository.repoData &&
        repository.repoData.map((repo, key) => (
          <div
            key={key}
            style={{
              margin: '10px',
              border: '1px solid #30363d',
              borderRadius: '5px',
              width: '80%',
              background: '#161b22',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
              <div style={{ color: '#8b949e' }}>{key + 1}</div>
              <div style={{ color: '#58a6ff' }}>{repo.htmlUrl}</div>
              <div style={{ display: 'flex' }}>
                <button
                  className="action-button"
                  style={{
                    backgroundColor: loadingStates[key]?.clone ? '#6a737d' : '#2ea44f',
                    color: '#fff',
                    padding: '10px',
                    fontSize: '16px',
                    cursor: loadingStates[key]?.clone ? 'not-allowed' : 'pointer',
                    border: 'none',
                    borderRadius: '6px',
                    marginRight: '5px',
                  }}
                  onClick={() => clone(key)}
                >
                  {loadingStates[key]?.clone ? 'Cloning...' : 'Clone'}
                </button>
                <button
                  className="action-button"
                  style={{
                    backgroundColor: loadingStates[key]?.remove ? '#6a737d' : '#d73a49',
                    color: '#fff',
                    padding: '10px',
                    fontSize: '16px',
                    cursor: loadingStates[key]?.remove ? 'not-allowed' : 'pointer',
                    border: 'none',
                    borderRadius: '6px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'background-color 0.3s, color 0.3s',
                  }}
                  onClick={() => remove(key)}
                >
                  
                  {loadingStates[key]?.remove ? (
                    'Removing...'
                  ) : (
                    <>
                      <span style={{ position: 'relative', zIndex: 1 ,color:'rgb(213,64,57)'}}>Delete</span>
                      <span
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgb(33,38,45)'
                        }}
                      ></span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default App;
