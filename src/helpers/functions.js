const checkValid = (meal, field) => {
  if (meal && meal.mealData && meal.mealData[field]) {
    return meal.mealData[field];
  }
};

const mapList = meals => {
  meals.map(
    (meal, id) =>
      meal.mealData && meal.mealData.title !== "" && meal.mealData.title
  );
};

export { checkValid, mapList };
