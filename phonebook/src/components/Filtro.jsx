import React from "react";

const Filtro = ({ handleFilterchange, searchPersons }) => {
  return (
    <>
      <div>
        Buscar:{" "}
        <input
          id="buscar"
          type="text"
          onChange={handleFilterchange}
          value={searchPersons}
          placeholder="buscar por nombre"
        />
      </div>
    </>
  );
};

export default Filtro;
