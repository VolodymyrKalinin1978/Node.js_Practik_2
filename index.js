import express from 'express';
import cors from 'cors';
import { v4 } from 'uuid';
import { promises as fs } from 'fs';

const app = express();

// The function for receiving users from a file
async function getUsersFromFile() {
  const usersDB = await fs.readFile('./data.json');
  return JSON.parse(usersDB);
}

// MIDDELWARE-------------------------------------------------
// bulit in
app.use(express.json());
app.use(cors());

// Castom Middekware
app.use((req, res, next) => {
 console.log('Heloo from Middelware!!!');

  next();
});

// Singl endpoint Middelware
app.use('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    // TEMP Save data to data.json its vsrtual DB
    const users = await getUsersFromFile();
    const user = users.find((item) => item.id === id);

    if (!user) {
      return res.status(404).json({
        msg: 'User not faund !!!'
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error .....;',
    });
  }
});

// CONTROLERS------------------------------------------------
// Check Server Helth
app.get('/ping', (req, res) => {
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
    const users = await getUsersFromFile();

    const newUser = {
      id: v4(),
      name,
      year,
      country
    };

    users.push(newUser);

    await fs.writeFile('./data.json', JSON.stringify(users));

    // Respons status

    res.status(201).json({
      msg: 'seccess',
      usser: newUser,
    });
console.table(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error .....;',
    });
  }
});
//--------------------------------------------------------------------
// Read meny
app.get('/users', async (req, res) => {
  try {
    const users = await getUsersFromFile();
    // TEMP Save data to data.json its vsrtual DB

    res.status(200).json({
      msg: 'seccess',
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error .....;',
    });
  }
});
//-------------------------------------------------------------------
// Read one
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const users = await getUsersFromFile();
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
    const users = await getUsersFromFile();
    const user = users.find((item) => item.id === id);

    if (name) {
      user.name = name;
    }
    if (year) {
      user.year = year;
    }
    if (country) {
      user.country = country;
    }

    await fs.writeFile('./data.json', JSON.stringify(users));

    // Respons status
    res.status(200).json({
      message: 'Інформація про користувача успішно оновлена',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error .....;',
    });
  }
});
//---------------------------------------------------------------------
// Delete
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await getUsersFromFile();
    const user = users.filter((u) => u.id !== id);

    await fs.writeFile('./data.json', JSON.stringify(user));

    // Respons status
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error .....;',
    });
  }
});

//--------------------------------------------------------------------
// Server initializatsons
const port = 3002;
app.listen(port, () => {
  console.log(`Server in up in server ${port}`);
});
