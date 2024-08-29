const express = require('express');
const port = 3000;

let users = [];

const app = express();
app.use(express.json());

app.get('/users', (req, res) => {
    try {
        res.status(200).json({
            message: "Succesfully get all users", data: users
        });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.post('/users', (req, res) => {
    try {
        const user = req.body;

        if (!user || !user.id || !user.name || !user.age) {
            return res.status(400).send({ message: 'User ID, name, and age are required' });
        }

        if (typeof user.id !== 'number' || isNaN(user.id) || user.id < 0 || 
        typeof user.age !== 'number' || isNaN(user.age) || user.age < 0) {
        return res.status(400).send({ message: 'User ID and age must be non-negative numbers' });
        }

        users.push(user);
        
        res.status(201).json({
            message: "Successfully created user",
            data: user
        });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.put('/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const user = req.body;
        if (!user || !user.id || !user.name || !user.age) {
            return res.status(400).send({ message: 'User ID, name, and age are required' });
        }

        const userIndex = users.findIndex((u) => u.id == id);
        if (userIndex === -1) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (typeof user.id !== 'number' || isNaN(user.id) || user.id < 0 || 
        typeof user.age !== 'number' || isNaN(user.age) || user.age < 0) {
        return res.status(400).send({ message: 'User ID and age must be non-negative numbers' });
        }

        users[userIndex] = user;

        res.status(200).json({
            message: "Succesfully updated user", data: user
        });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const initialLength = users.length;
        users = users.filter((u) => u.id != id);
        if (users.length === initialLength) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(204).send({ message: 'Succesfully deleted user' }).end();
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/users/search', (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).send({ message: 'Name is required' });
        }
        const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(name.toLowerCase()));

        if (filteredUsers.length === 0) {
            return res.status(404).send({ message: 'No users found matching the provided name' });
        }

        res.status(200).json({
            message: "Succesfully get user(s)", data: filteredUsers
        });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
