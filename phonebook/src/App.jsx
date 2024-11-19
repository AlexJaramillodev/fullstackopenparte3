import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Formulario from "./components/Formulario";
import Filtro from "./components/Filtro";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchPersons, setSearchPersons] = useState("");
  const [mesagge, setMessage] = useState(null)
  const [type, setType] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((error) => {
        console.log("fail", error);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const personExist = persons.find((person) => person.name === newName);
    const numberExist = persons.find( (person) => person.name === newName && person.number  === newNumber)

   
    if (numberExist){
      alert (`El usuario ${newName} con el numero ${newNumber} ya se encuentra en la agenda`)
    }else if (personExist) {
      window.confirm(
        `El usuario ${newName} ya tiene un numero telefonico, desear reemplazarlo por el nuevo?`
      );
      const updatePerson = { ...personExist, number: newNumber };

      personsService
        .update(personExist.id, updatePerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== personExist.id ? person : returnedPerson
            )
          );
          setMessage(`El usuario ${personExist.name} fue actualizado con exito`)
          setTimeout(() => {
            setMessage(null)
          }, 10000)
          setNewName("");
          setNewNumber("");
          setType('exito')
        })
        .catch(error => {
          setMessage(`El usuario ${personExist.name} ha sido eliminado de la agenda`)
          setTimeout (() => {
            setMessage(null)
          }, 10000)
          setPersons(persons.filter((person) => person.id !== personExist.id))
          setType('error')
        })
    } else if (newName === "" || newNumber === "") {
      alert("Por favor ingrese un dato, los campos no pueden estar vacios");
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        //id: persons.length + 1,
      };

      personsService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setMessage(`El usuario ${personObject.name} fue creado con exito`)
          setTimeout(() => {
            setMessage(null)
          }, 10000)
          setNewName("");
          setNewNumber("");
          setType('exito')
        })
        .catch((error) => {
          console.log("fail", error.response.data.error);
          setMessage(error.response.data.error)
          setTimeout (() => {
            setMessage(null)
          }, 10000)
          setType('error')
        });
    }
  };

  const deleteUsuarioSelected = (id, name) => {
    const confirmDelete = window.confirm(
      `Estas seguro que quieres eliminar el usuario ${name}`
    );

    if (confirmDelete) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setMessage(`El usuario ${name} fue eliminado`)
          setTimeout(() => {
            setMessage(null)
          }, 10000)
          setType('exito')
        })
        .catch((error) => {
          console.log("fail", error);
        });
    }
  };

  const handlePersonChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterchange = (event) => {
    console.log(event.target.value);
    setSearchPersons(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchPersons.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={mesagge} type={type}/>
      <Filtro
        handleFilterchange={handleFilterchange}
        searchPersons={searchPersons}
      />
      <h2>Agregar Nuevo</h2>
      <Formulario
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handlePersonChange={handlePersonChange}
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numeros</h2>
      <Persons
        persons={filteredPersons}
        deleteUsuario={deleteUsuarioSelected}
      />
    </div>
  );
};

export default App;
