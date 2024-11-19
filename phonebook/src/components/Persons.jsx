import React from "react";

const Persons = ({ persons, deleteUsuario }) => {
  return (
    <>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deleteUsuario(person.id, person.name)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Persons;
