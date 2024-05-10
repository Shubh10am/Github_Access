import React, { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);

  const reposPerPage = 6;
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingUser(true);
      setErrorUser(null);
      setLoadingRepos(true);
      setErrorRepos(null);

      const userData = await axios.get(
        `https://api.github.com/users/${username}`
      );
      setUser(userData.data);

      let allRepos = [];
      let page = 1;
      let reposResponse;
      do {
        reposResponse = await axios.get(
          `https://api.github.com/users/${username}/repos`,
          {
            params: { per_page: 100, page: page },
          }
        );
        allRepos = [...allRepos, ...reposResponse.data];
        page++;
      } while (reposResponse.data.length === 100);

      setRepos(allRepos);
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
        {currentRepos.map((repo) => (
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
      <div className="pagination">
        {Array.from({ length: Math.ceil(repos.length / reposPerPage) }).map(
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePagination(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default UserProfile;
