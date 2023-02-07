const getAllCodes = () => {
  let localCodes = localStorage.getItem("codes");
  localCodes = JSON.parse(localCodes);
  if (!localCodes) localCodes = [];
  console.log(localCodes);
  return localCodes;
};

const getCodeById = (id) => {
  let file = getAllCodes().find((codeObj) => codeObj.id === Number(id));
  return file;
};

const saveCodeToDB = (code) => {
  let localCodes = getAllCodes();
  localCodes.push(code);
  localStorage.setItem("codes", JSON.stringify(localCodes));
};

const updateCode = (newCode) => {
  const allFiles = getAllCodes().map((codeObj) => {
    if (codeObj.id == newCode.id) return newCode;
    return codeObj;
  });
  localStorage.setItem("codes", JSON.stringify(allFiles));
};

const deleteCode = (id) => {
  let localCodes = getAllCodes().filter((codeObj) => codeObj.id !== Number(id));
  deleteImage(id);
  localStorage.setItem("codes", JSON.stringify(localCodes));
};

const deleteImage = (id) => {
  let images = getAllPreviewImages();
  delete images[id];
  localStorage.setItem("images", JSON.stringify(images));
};

const getAllPreviewImages = () => {
  let localImages = localStorage.getItem("images");
  localImages = JSON.parse(localImages);
  if (!localImages) localImages = {};
  return localImages;
};

const savePreviewImage = (id, dataURI) => {
  let localImages = getAllPreviewImages();
  localImages[id] = dataURI;
  localStorage.setItem("images", JSON.stringify(localImages));
};

const getPreviewImage = (id) => {
  let localImages = getAllPreviewImages();
  return localImages[id];
};

export {
  getAllCodes,
  saveCodeToDB,
  deleteCode,
  getCodeById,
  updateCode,
  savePreviewImage,
  getAllPreviewImages,
};
