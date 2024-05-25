import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './RepoDetails.css';

const RepoDetails = () => {
  const { owner, repo } = useParams();
  const [repoDetails, setRepoDetails] = useState(null);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
        const commitsResponse = await axios.get(`/api/github/repos/${owner}/${repo}/commits`);
        setRepoDetails(repoResponse.data);
        setCommits(commitsResponse.data);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [owner, repo]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="repo-details">
      {repoDetails && (
        <div>
          <h2>{repoDetails.name}</h2>
          <p>{repoDetails.description}</p>
          <p>Last commit date: {new Date(repoDetails.updated_at).toLocaleDateString()}</p>
          <a href={repoDetails.html_url} target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
      )}
      <h3>Commits</h3>
      <ul>
        {commits.map((commit) => (
          <li key={commit.sha}>
            <p>{commit.commit.message}</p>
            <p>{new Date(commit.commit.author.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoDetails;
