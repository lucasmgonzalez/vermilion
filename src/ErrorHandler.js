module.exports = (err, req, res) => {
  console.error(err);

  res.status(err.status || 500).json(err);
}
