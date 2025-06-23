



2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

-tasks 
   - create a dashboard that summarizes the protein, calories, and carbs for the day
   - create a logger page for the user to log their meals/snacks for the day with the ability to add the nutrients for each item being added
   - create an energy expenditure logger 
   - add feature for setting goals for nutrients and energy expenditure 
   - maybe add a label scanning feature

pseudocode for making an add food page
   - create drop-down menu for selecting meal
   - create search/input bar for name of food
   - create 

agenda for today(3/20/2025)
   -addfood.tsx
      -make it so that whenever the item(food and amount) is submitted, I make a get request to the spoonacular api, which then returns the list of food items that I can choose. 
      -After that data is returned, I need to display it in the addfood.tsx page as a list of items. 
      - after that, make it so that the food items shown in the list can be picked so that the particular chosen food item with its amount is then added to the logger page.

      CURRENT STATUS OF addfood.tsx
      - right now what is function correctly is the page's ability to write a food name and amount and then enter that food name and amount to the logger page. It is not capable of taking any nutrition data about that food and then displaying that nutrition data to anywhere. 