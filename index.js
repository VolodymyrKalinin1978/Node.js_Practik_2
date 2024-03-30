// const express = require('express');
// const fs = require('fs/promises');
// const cors = require('cors');
// const { v4 } = require('uuid');

import express, { json } from 'express';
import cors from 'cors';
import { v4 } from 'uuid';
import { promises as fs } from 'fs';

const app = express();

// MIDDELWARE-------------------------------------------------
// bulit in
app.use(express.json());

// Castom Middekware
app.use((req, res, next) => {
 

 next();
});

// CONTROLERS------------------------------------------------
// Check Server Helth
app.get('/ping', (req, res) => {
  // res.send('<h1>Hello Server is live<h1>');
  // res.sendStatus(200);
  res.status(200).json({
    status: 'seccess',
    data: 'Hello from Api',
    test: null,
  });
});

/**
 * REST api (Create, Read, Update, Delete)
 * POST, GET, PATCH (PUT), DELETE
 *
 * POST         /users
 * GET          /users
 * GET          /users/<userId>
 * PATCH (PUT)  /users/<userId>
 * DELETE       /users/<userId>
 */
//---------------------------------------------------------------------
// Create
app.post('/users', async (req, res) => {
  try {
    const { name, year, country } = req.body;

    const newUser = {
      id: v4(),
      name,
      year,
      country
    };

    // TEMP Save data to data.json its vsrtual DB
    const usersDB = await fs.readFile('./data.json');
    const users = JSON.parse(usersDB);
    users.push(newUser);

    await fs.writeFile('./data.json', JSON.stringify(users));
    // Respons status

    res.status(201).json({
      msg: 'seccess',
      usser: newUser,
    });
console.log(req.body);
  } catch (error) {
    console.log(error);
  }
});
//--------------------------------------------------------------------
// Read meny
app.get('/users', async (req, res) => {
  // TEMP Save data to data.json its vsrtual DB
  const usersDB = await fs.readFile('./data.json');

  const users = JSON.parse(usersDB);

  res.status(200).json({
    msg: 'seccess',
    users,
  });
});
//-------------------------------------------------------------------
// Read one
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  // TEMP Save data to data.json its vsrtual DB
  const usersDB = await fs.readFile('./data.json');

  const users = JSON.parse(usersDB);

  const user = users.find((item) => item.id === id);

  res.status(200).json({
    msg: 'seccess',
    user,
  });
});
//---------------------------------------------------------------------
// Update
app.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year, country } = req.body;

    // TEMP Save data to data.json its vsrtual DB
    const usersDB = await fs.readFile('./data.json');
    const users = JSON.parse(usersDB);
    const index = users.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    if (name) {
      users[index].name = name;
    }
    if (year) {
      users[index].year = year;
    }
    if (country) {
      users[index].country = country;
    }

    await fs.writeFile('./data.json', JSON.stringify(users));

    // Respons status
    res.status(200).json({
      message: 'Інформація про користувача успішно оновлена',
      user: users[index],
    });
  } catch (error) {
    console.log(error);
  }
});
//---------------------------------------------------------------------
// Delete
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TEMP Save data to data.json its vsrtual DB
    const usersDB = await fs.readFile('./data.json');
    const users = JSON.parse(usersDB);
    const index = users.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    users.splice(index, 1);
    await fs.writeFile('./data.json', JSON.stringify(users));

    // Respons status
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
  }
});

//--------------------------------------------------------------------
// Server initializatsons
const port = 3002;
app.listen(port, () => {
  console.log(`Server in up in server ${port}`);
});
