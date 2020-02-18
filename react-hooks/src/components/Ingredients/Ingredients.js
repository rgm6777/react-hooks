import React, { useState, useCallback, useEffect } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {

  const [ userIngredients, setUserIngredients ] = useState([]);

  {/*After and every update render lifecycle this fuction is executed!*/}
  useEffect(() => {
    fetch('https://react-hooks-c6925.firebaseio.com/ingredients.json')
      .then(res => res.json())
      .then(resData => {
        const loadedIngredients = [];
        for (const key in resData) {
          loadedIngredients.push({
            id: key,
            title: resData[key].title,
            amount: resData[key].amount
          });
        }
        setUserIngredients(loadedIngredients);
      });
  }, []); {/*Prevents infite rerendering of component*/}

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-c6925.firebaseio.com/ingredients.json',{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type' : 'application/json'}
    }).then(res => {
      return res.json()
    }).then(resData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        { id: resData.name , ...ingredient }]
      )
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients)
  },[]);

  const removeIngredientHandler = ingredientId => {
    console.log(ingredientId);
    // setUserIngredients(prevIngredients => 
    //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
    fetch(`https://react-hooks-c6925.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    ).then(res => {
      console.log(res)
      setUserIngredients(prevIngredients => {
        prevIngredients.filter(ingredient => ingredientId !== ingredient)
      })
    });
  }

  return (
    <div className="App">
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {/* Need to add list here! */}
        <IngredientList 
          ingredients={userIngredients} 
          onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
