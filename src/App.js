import React, { useState } from "react";
import axios from "axios";
import "./styles.css"; // Import CSS file for styling

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [errorRepos, setErrorRepos] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingUser(true);
      setErrorUser(null);
      setLoadingRepos(true);
      setErrorRepos(null);

      const [userData, repoData] = await Promise.all([
        axios.get(`https://api.github.com/users/${username}`),
        axios.get(`https://api.github.com/users/${username}/repos`),
      ]);

      setUser(userData.data);
      setRepos(repoData.data);
      setLoadingUser(false);
      setLoadingRepos(false);
    } catch (error) {
      console.error("Error fetching user profile or repositories:", error);
      setErrorUser("User not found");
      setErrorRepos("Error fetching repositories");
      setLoadingUser(false);
      setLoadingRepos(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">
          Search
        </button>
      </form>

      {loadingUser && <div>Loading user...</div>}
      {errorUser && <div>{errorUser}</div>}
      {user && (
        <div className="profile-container">
          <div className="profile-info">
            <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
            <div>
              <h1>{user.login}</h1>
              <p>Followers: {user.followers}</p>
              <p>Following: {user.following}</p>
              <p>Public Repos: {user.public_repos}</p>
              <p>Twitter ID: {user.twitter_username}</p>
              <p>GitHub ID: {user.login}</p>
            </div>
          </div>
        </div>
      )}

      {loadingRepos && <div>Loading repositories...</div>}
      {errorRepos && <div>{errorRepos}</div>}
      <div className="repo-container">
        {repos.map((repo) => (
          <div className="repo-tile" key={repo.id}>
            <h3>{repo.name}</h3>
            <p>{repo.description}</p>
            <p>Language: {repo.language}</p>
            <p>Stars: {repo.stargazers_count}</p>
            <p>Watchers: {repo.watchers_count}</p>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
