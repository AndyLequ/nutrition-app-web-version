
//   useEffect(() => {
//     // const fetchBanana = async () => {
//     //   try {
//     //     const response = await axios.get(
//     //       "https://api.spoonacular.com/food/ingredients/9266/information?amount=1",
//     //       {
//     //         headers: {
//     //           "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
//     //         },
//     //       }
//     //     );
//     //     console.log(response.data);
//     //   } catch (error) {
//     //     console.error("Error fetching data from spoonacular API", error);
//     //   }
//     // };
//     // fetchBanana();
//   }, []);

//   //search ingredients function
//   // `https://api.spoonacular.com/food/ingredients/search?query=${food}&${number}=2&sort=calories&sortDirection=desc`
//   const ingredientName = "banana";
//   const ingredientQuantity = "2";
//   useEffect(() => {
//     const fetchIngredients = async () => {
//       try {
//         const response = await axios.get<IngredientResponse>(
//           `https://api.spoonacular.com/food/ingredients/search?query=${ingredientName}&number=${ingredientQuantity}&sort=calories&sortDirection=desc`,
//           {
//             headers: {
//               "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
//             },
//           }
//         );
//         setIngredients(response.data);
//       } catch (error) {
//         //handle error
//         console.error("Error fetching data from spoonacular API", error);
//       }
//     };
//     fetchIngredients();
//   }, []);


//   // get the nutrition facts about the ingredient selected
//   const fetchNutrition = async () => {
//     try {
//       const response = await axios.get(
//         // using id to select which ingredient we need
//         // https://api.spoonacular.com/food/ingredients/${id}/information?amount=1
//       )
//     } catch (error) {
//       //error for when gettin ingredient fails 
//     }
//   }