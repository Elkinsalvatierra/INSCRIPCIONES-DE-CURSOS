function TarjetaCurso({ curso }) {
  return (
    <article className="tarjeta-curso">
      <img src={curso.imagen} alt="" />
      <div>
        <h2>{curso.nombre}</h2>
        <p>{curso.descripcion}</p>
      </div>
    </article>
  );
}

export default TarjetaCurso;
