/**
     * This function validate the authentication input by user
     * @param {int} outputLength - the length of the random string output.
     * @returns {string} random string
     */
const getRandomString = (outputLength = 15) => {
  const idNum = outputLength;
  let textOutput = '';
  const poss = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < idNum; i += 1) {
    textOutput += poss.charAt(Math.floor(Math.random() * poss.length));
  }
  return (`ship-it-${textOutput}`);
};

export default getRandomString;
