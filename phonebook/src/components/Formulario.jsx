import React from "react";

const Formulario = ({
  addPerson,
  newName,
  handlePersonChange,
  newNumber,
  handlePhoneChange,
}) => {
  return (
    <>
      <form onSubmit={addPerson}>
        <div>
          nombre:{" "}
          <input id="nombre" type="text" value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          telefono:{" "}
          <input id="telefono" type="tel" value={newNumber} onChange={handlePhoneChange} />
        </div>
        <div>
          <button type="submit">Agregar</button>
        </div>
      </form>
    </>
  );
};

export default Formulario;
