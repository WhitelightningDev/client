import React, { useState } from 'react';
import axios from 'axios';
import {
    Container, TextField, Button, Typography, Card, CardContent,
    CardMedia, List, ListItem, ListItemText, CircularProgress, Alert
} from '@mui/material';
import './App.css';

// Replace 'YOUR_PERSONAL_ACCESS_TOKEN' with your actual GitHub personal access token
const token = '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';

const axiosInstance = axios.create({
  headers: {
    Authorization: `token ${token}`,
  },
});

const App = () => {
    const [username, setUsername] = useState('WhitelightningDev');
    const [userInfo, setUserInfo] = useState(null);
    const [repos, setRepos] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchUserInfo = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axiosInstance.get(`/api/github/user/${username}`);
            setUserInfo(response.data);
        } catch (error) {
            setError('User not found.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRepos = async () => {
        try {
            const response = await axiosInstance.get(`/api/github/user/${username}/repos`);
            setRepos(response.data);
        } catch (error) {
            setError('Failed to fetch repositories.');
        }
    };

    const fetchRepoDetails = async (repoName) => {
        try {
            const response = await axiosInstance.get(`https://api.github.com/repos/${username}/${repoName}`);
            setSelectedRepo(response.data);
        } catch (error) {
            setError('Failed to fetch repository details.');
        }
    };

    const fetchRepoCommits = async (repoName) => {
        try {
            const response = await axiosInstance.get(`/api/github/repos/${username}/${repoName}/commits`);
            setCommits(response.data);
        } catch (error) {
            setError('Failed to fetch commits.');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        await fetchUserInfo();
        await fetchUserRepos();
    };

    const handleRepoClick = async (repoName) => {
        await fetchRepoDetails(repoName);
        await fetchRepoCommits(repoName);
    };

    return (
        <Container>
            <Typography variant="h3" gutterBottom>GitHub User Info</Typography>
            <form onSubmit={handleSearch}>
                <TextField
                    label="GitHub Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>Search</Button>
            </form>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {userInfo && (
                <Card sx={{ marginTop: 2 }}>
                    <CardContent>
                        <Typography variant="h5">{userInfo.name} ({userInfo.login})</Typography>
                        <Typography variant="body1">{userInfo.bio}</Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        height="140"
                        image={userInfo.avatar_url}
                        alt="avatar"
                    />
                </Card>
            )}
            {repos.length > 0 && (
                <>
                    <Typography variant="h4" gutterBottom>Repositories</Typography>
                    <List>
                        {repos.map(repo => (
                            <ListItem button key={repo.id} onClick={() => handleRepoClick(repo.name)}>
                                <ListItemText primary={repo.name} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
            {selectedRepo && (
                <Card sx={{ marginTop: 2 }}>
                    <CardContent>
                        <Typography variant="h5">Repository Details</Typography>
                        <Typography variant="body1">Name: {selectedRepo.name}</Typography>
                        <Typography variant="body1">Description: {selectedRepo.description}</Typography>
                        <Typography variant="body1">Created At: {new Date(selectedRepo.created_at).toLocaleDateString()}</Typography>
                        <Typography variant="body1">Last Commit: {new Date(selectedRepo.pushed_at).toLocaleDateString()}</Typography>
                    </CardContent>
                </Card>
            )}
            {commits.length > 0 && (
                <>
                    <Typography variant="h5" gutterBottom>Last 5 Commits</Typography>
                    <List>
                        {commits.map(commit => (
                            <ListItem key={commit.sha}>
                                <ListItemText
                                    primary={commit.commit.message}
                                    secondary={new Date(commit.commit.author.date).toLocaleDateString()}
                                />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </Container>
    );
};

export default App;
