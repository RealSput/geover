const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

if (!fs.existsSync('levels.json')) fs.writeFileSync('levels.json', '{}');

// this is weak security, but idc considering that no one will use it anyways
app.post('/api/init', (req, res) => {
  let {
    username,
    repo,
    password
  } = req.body;
  let data = JSON.parse(fs.readFileSync('levels.json'));
  let starter = data[username.repos];
  if (!starter) {
    starter = JSON.parse(`{ "${repo}": { "contributors": [], "versions": [] } }`)
  } else {
    starter[repo] = {
      contributors: [],
      versions: []
    }
  }
  if (!data[username]) {
    data[username] = {
      password,
      repos: starter
    }
  } else {
    if (password == data[username].password) {
      data[username].repos[repo] = { contributors: [], versions: [] };
    } else {
      res.json({ success: false, reason: 'incorrect password' });
      return;
    }
  }
  fs.writeFileSync('levels.json', JSON.stringify(data));
  res.json({ success: true, reason: 'Initialized repository successfully' });
});

// i'm gonna regret writing this code when I get a job LMAO
app.get('/api/fetch', (req, res) => {
  let repo = req.query.repo.split('/');
  let data = JSON.parse(fs.readFileSync('levels.json'));
  if (data[repo[0]]) {
    if (data[repo[0]].repos[repo[1]]) {
      if (data[repo[0]].repos[repo[1]].length !== 0) {
        let vers = data[repo[0]].repos[repo[1]].versions;
        res.json({ success: true, reason: vers[vers.length - 1] });
      } else {
        res.json({ success: false, reason: 'no versions found' });
      }
    } else {
      res.json({ success: false, reason: 'repo does not exist' });
      return;
    }
  } else {
    res.json({ success: false, reason: 'user does not exist' });
    return;
  }
})

// ok here comes the part where you can actually edit repos
app.post('/api/push', (req, res) => {
  let data = JSON.parse(fs.readFileSync('levels.json'));
  let level = req.body.level;
  let { repo, username, password } = req.query;
  if (data[username].repos[repo].contributors.indexOf(username) !== -1 || data[username].password === password) {
    data[username].repos[repo].versions.push(level);
    res.json({ success: true, reason: 'Pushed to repo' });
  } else {
    res.json({ success: false, reason: 'Access denied for current user' });
    return;
  }
  fs.writeFileSync('levels.json', JSON.stringify(data));
});

// rverert
app.post('/api/revert', (req, res) => {
  let data = JSON.parse(fs.readFileSync('levels.json'));
  let { repo, username, password } = req.query;
  let times = Math.abs(req.body.amount) * -1;
  if (!data[username].repos[repo]) {
    res.json({ success: false, reason: 'Repo does not exist'});
    return;
  }
  if (data[username].repos[repo].contributors.indexOf(username) !== -1 || data[username].password === password) {
    data[username].repos[repo].versions.slice(0, times);
    res.json({ success: true, reason: 'Reverted changes' });
  } else {
    res.json({ success: false, reason: 'Access denied for current user' });
    return;
  }
  fs.writeFileSync('levels.json', JSON.stringify(data));
});

// my favorite feature
app.post('/api/invite', (req, res) => {
  let data = JSON.parse(fs.readFileSync('levels.json'));
  let { repo, username, password, receiver } = req.query;

  if (data[username].password === password) {
    data[username].repos[repo].contributors.push(receiver);
    res.json({ success: true, reason: 'User invited successfully' });
  } else {
    res.json({ success: false, reason: 'Access denied for current user' });
    return;
  }

  fs.writeFileSync('levels.json', JSON.stringify(data));
});

app.listen(8080);
