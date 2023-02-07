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
  localStorage.setItem("codes", JSON.stringify(localCodes));
};

export { getAllCodes, saveCodeToDB, deleteCode, getCodeById, updateCode };
