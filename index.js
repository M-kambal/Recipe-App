const meals = document.getElementById('meals');
const favmeals = document.getElementById('fav-meals');
const searchBtn = document.getElementById('search');
const searchTerm = document.getElementById('search-term');

getRandomMeal();
favMeals()


async function getRandomMeal() {
  const resp = await fetch(
    'https://www.themealdb.com/api/json/v1/1/random.php'
  );
  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  addMeal(randomMeal, true)
}

async function getMealById(id) {
  const res = await fetch(
    'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id
  );
  const resData = await res.json();
  const meal = resData.meals[0];
  return meal;
}

async function getMealsBySearch(term) {
  const resp = await fetch(
    'https://www.themealdb.com/api/json/v1/1/search.php?s= ' + term
  );

  const respData = await resp.json();
  const meals =  respData.meals;

  return meals;
}

function addMeal(mealData, random = false) {
  const meal = document.createElement('div');
  meal.classList.add('meal');

  meal.innerHTML = `
  <div class="meal-header">
    ${
      random
            ? `
        <span class="random">Random Recipe</span>`
         : ''
       }
        <img
        src="${mealData.strMealThumb}"
        alt="${mealData.strMeal}">
      </div>
      <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn" type="button" name="button">
        <i class="fas fa-heart"></i>
        </button>
      </div>
  `;

  const btn = meal.querySelector('.meal-body .fav-btn');
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) {
      removeMealLS(mealData.idMeal)
      btn.classList.remove('active')
    } else {
      addMealLS(mealData.idMeal)
      btn.classList.add('active')

        favMeals()
    }
  });

  meals.appendChild(meal)
}

function addMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}


function removeMealLS(mealId) {
  const mealIds = getMealsLS();
  localStorage.setItem(
    'mealIds',
    JSON.stringify(mealIds.filter(id => id !==
      mealId))
  );
}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'));
  return mealIds === null ? [] : mealIds;

}


async function favMeals() {

  //clean the container

  //favmeals.innerHTML = "",

  const mealIds = getMealsLS();
  const meals = [];
  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];

    meal = await getMealById(mealId);
    addMealFav(meal);
  }
  //console.log(meals);
  // add meal them to the screen
}

function addMealFav(mealData) {

  const favMeal = document.createElement('li');
  favMeal.innerHTML = `
  <li>
    <img src="${mealData.strMealThumb}"
     alt="${mealData.strMeal}">
      <span>${mealData.strMeal}</span>
      <button class= 'clear'><i class="fas fa-window-close"></i></button>
  </li>

  `;

  const btn = favMeal.querySelector('.clear')
  btn.addEventListener('click', () => {
    removeMealLS(mealData.idMeal)

    favMeals();

  });
    favmeals.appendChild(favMeal)
}

searchBtn.addEventListener('click', async () => {
  const search = searchTerm.value;
  const meals = await getMealsBySearch(search);
  if(meals){
  meals.forEach(meal => {
    addMeal(meal)
  });
}
});
