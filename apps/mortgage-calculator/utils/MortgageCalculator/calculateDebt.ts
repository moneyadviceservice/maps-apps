const calculateDebt = (price: number, deposit: number) => {
  return price - deposit || 0;
};

export default calculateDebt;
