const Loading = () => {
  return (
    <div
      className="text-center d-flex align-items-center"
      style={{ margin: "300px 0", marginLeft: "50%" }}
    >
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
