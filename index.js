import express, { json } from 'express';
import cors from 'cors';
import { v4 } from 'uuid';
import { promises as fs } from 'fs';

const app = express();

// Utels Get users from Json
async function getUser() {
  try {
    const usersDB = await fs.readFile('./data.json');
    const users = JSON.parse(usersDB);
    return users;
  } catch (error) {
  console.log(error);
  }
}

// MIDDELWARE-------------------------------------------------
// bulit in
app.use(express.json());

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
    const users = await getUser();
    const user = users.find((item) => item.id === id);

    if (!user) {
      return res.status(404).json({
        msg: 'User not faund !!!'
      });
    }

    // Send user for Delete
    const userDel = users.filter((u) => u.id !== id);

    req.user = user;
    req.users = users;
    req.userDel = userDel;

    next();
  } catch (error) {
    console.log(error);
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

    const newUser = {
      id: v4(),
      name,
      year,
      country
    };

    const users = await getUser();
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
  }
});
//--------------------------------------------------------------------
// Read meny
app.get('/users', async (req, res) => {
  // TEMP Save data to data.json its vsrtual DB
  const users = await getUser();

  res.status(200).json({
    msg: 'seccess',
    users,
  });
});
//-------------------------------------------------------------------
// Read one
app.get('/users/:id', (req, res) => {
  const { user } = req;

  res.status(200).json({
    msg: 'seccess',
    user,
  });
});
//---------------------------------------------------------------------
// Update
app.patch('/users/:id', async (req, res) => {
  try {
    const { name, year, country } = req.body;
    const { user, users } = req;

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
  }
});
//---------------------------------------------------------------------
// Delete
app.delete('/users/:id', async (req, res) => {
  try {
    const { userDel } = req;

    await fs.writeFile('./data.json', JSON.stringify(userDel));

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
