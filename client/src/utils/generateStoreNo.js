export const handleGenerate = (setStoreNo) => {
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");

  const newStoreNo = `LIZASO-${formattedDate}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
  setStoreNo(newStoreNo);
};
