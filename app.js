//Select DOM elements
const ingredientForm = document.getElementById('ingredient-form');  //The form where the user enters ingredients
const ingredientInput = document.getElementById('ingredient-input');  //The input field for new ingredients
const ingredientList = document.getElementById('ingredient-list');  //The list where ingredients will be displayed
const recipeResults = document.getElementById('recipe-results');  //The area where recipe results will be displayed

let ingredients = [];  //Array to store the ingredients entered by the user

//API Key for Spoonacular -- I had to make an account for the API key
const API_KEY = 'dc90120f8fc84f05b0aafd96f1f88cc2';

//Function for creating Ingredient list
function updateIngredientList() {
  ingredientList.innerHTML = '';  //Clear the current list

  ingredients.forEach(ing => {
    const span = document.createElement('span');  //Create tag for ingredient
    span.className = 'ingredient-tag';  //Class for styling
    span.textContent = ing;  //Display the ingredient

    //Create a remove button (×)
    const removeBtn = document.createElement('button');
    removeBtn.textContent = ' ×';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = () => removeIngredient(ing);  //Remove when clicked

    span.appendChild(removeBtn);  //Add the button to the tag
    ingredientList.appendChild(span);  //Add the tag to the list
  });

  fetchRecipes();  //Fetch updated recipes
}
 //Function to remove ingredients
function removeIngredient(ingredient) {
  ingredients = ingredients.filter(ing => ing !== ingredient); //Remove the selected ingredient
  updateIngredientList(); //Refresh the list and recipe results
}


//Function to fetch recipes from the Spoonacular API
async function fetchRecipes() {
  recipeResults.innerHTML = '<p>Loading recipes...</p>';  //Display loading text while fetching
  const query = ingredients.join(',');  //Join ingredients into a comma-separated string for the API query
  try {
    //Make a request to the Spoonacular API with the ingredients
    const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${query}&number=10&apiKey=${API_KEY}`);
    const data = await response.json();  //Parse the JSON response
    displayRecipes(data);  //Call the function to display the fetched recipes
  } catch (error) {
    //Handle any errors from the API request
    recipeResults.innerHTML = '<p>Error fetching recipes. Please try again.</p>';
    console.error('API fetch error:', error);  //Log the error to the console for debugging
  }
}

//Function to display the fetched recipes on the page
function displayRecipes(recipes) {
  recipeResults.innerHTML = '';  //Clear the current recipe results
  if (!recipes.length) {
    recipeResults.innerHTML = '<p>No matching recipes found.</p>';  //If no recipes were found, show this message
    return;
  }

  //Loop through the fetched recipes and display each one
  recipes.forEach(recipe => {
    const div = document.createElement('div');  //Create a new div for each recipe
    div.className = 'recipe';  //Add a class for styling
    div.innerHTML = `
      <h3>${recipe.title}</h3>  <!-- Display recipe title -->
      <img src="${recipe.image}" alt="${recipe.title}" style="max-width:100%; height:auto;">  <!-- Display recipe image -->
      <p><a href="https://spoonacular.com/recipes/${recipe.title.replace(/ /g, '-')}-${recipe.id}" target="_blank">View full recipe</a></p>  <!-- Link to full recipe page -->
    `;
    recipeResults.appendChild(div);  //Append the recipe div to the results area
  });
}

//Event listener to handle form submission
ingredientForm.addEventListener('submit', e => {
  e.preventDefault();  //Prevent the form from submitting the default way (reloading the page)
  const newIngredient = ingredientInput.value.trim().toLowerCase();  //Get the new ingredient from input and format it

  // Simple regex: only letters and spaces allowed
  if (!/^[a-z\s]+$/.test(newIngredient)) {
    alert('Please enter letters and spaces only.');
    ingredientInput.value = '';
    return;
  }

  if (newIngredient && !ingredients.includes(newIngredient)) {
    ingredients.push(newIngredient);  //Add the ingredient to the array if it's not already there
    updateIngredientList();  //Update the ingredient list display
  }
  ingredientInput.value = '';  //Clear the input field after submitting
});

