const renderArtist = () => {
  const itemsSold = document.querySelector(".items-sold-val");
  const totalIncome = document.querySelector(".total-income-val");
  const artistName = localStorage.getItem("artist");

  const artistItems = itemsLC.filter((item) => item.artist === artistName);

  const soldItems = artistItems.filter((item) => item.dateSold);
  const totalIncomeVal = soldItems.reduce((sum, item) => {
    return sum + item.priceSold;
  }, 0);

  itemsSold.textContent = soldItems.length + "/" + artistItems.length;
  totalIncome.textContent = "$" + totalIncomeVal;
};
