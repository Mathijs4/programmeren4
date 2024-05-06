//
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.
//
const database = {
  // het array met dummy records. Dit is de 'database'.
  _data: [
    {
      id: 0,
      firstName: 'Hendrik',
      lastName: 'van Dam',
      emailAdress: 'hvd@server.nl',
      // Hier de overige velden uit het functioneel ontwerp
    },
    {
      id: 1,
      firstName: 'Marieke',
      lastName: 'Jansen',
      emailAdress: 'm@server.nl',
      // Hier de overige velden uit het functioneel ontwerp
    },
  ],

  // Ieder nieuw item in db krijgt 'autoincrement' index.
  // Je moet die wel zelf toevoegen aan ieder nieuw item.
  _index: 2,
  _delayTime: 500,

  getAll(callback) {
    // Simuleer een asynchrone operatie
    setTimeout(() => {
      // Roep de callback aan, en retourneer de data
      callback(null, this._data);
    }, this._delayTime);
  },

  getById(userId, callback) {
    // Simuleer een asynchrone operatie
    setTimeout(() => {
      console.log(this._data);
      if (userId < 0 || userId >= this._data.length) {
        callback(
          { status: 404, message: `Error: id ${userId} does not exist!` },
          null
        );
      } else {
        let user = this._data.find((user) => user.id === userId);

        callback(null, user);
        console.log(user);
      }
    }, this._delayTime);
  },

  add(item, callback) {
    // Simuleer een asynchrone operatie
    setTimeout(() => {
      // Voeg een id toe en voeg het item toe aan de database
      item.id = this._index++;
      // Voeg item toe aan de array
      this._data.push(item);

      console.log(this._data);
      // Roep de callback aan het einde van de operatie
      // met het toegevoegde item als argument, of null als er een fout is opgetreden
      callback(null, item);
    }, this._delayTime);
  },

  updateById(userId, updatedData, callback) {
    setTimeout(() => {
      if (userId < 0 || userId >= this._data.length) {
        callback(
          { status: 404, message: `Error: id ${userId} does not exist!` },
          null
        );
      } else {
        this._data[userId] = { ...this._data[userId], ...updatedData };
        callback(null, this._data[userId]);
      }
    }, this._delayTime);
  },
};

module.exports = database;
// module.exports = database.index;
