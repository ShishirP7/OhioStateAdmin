export const menuItems = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheddar, lettuce, tomato, and pickles.",
    category: "Burgers",
    price: 8.99,
    image: "path/to/burger.jpg",
    status: "Available",
    options: {
      sizes: [
        { label: "Single", priceModifier: 0 },
        { label: "Double", priceModifier: 2 },
        { label: "Triple", priceModifier: 4 }
      ],
      addOns: [
        { label: "Extra Cheese", priceModifier: 1 },
        { label: "Bacon", priceModifier: 1.5 },
        { label: "Fried Egg", priceModifier: 1 },
        { label: "Avocado", priceModifier: 1.5 }
      ],
      sauces: [
        { label: "Ketchup", priceModifier: 0 },
        { label: "Mustard", priceModifier: 0 },
        { label: "BBQ Sauce", priceModifier: 0.5 },
        { label: "Garlic Aioli", priceModifier: 0.7 }
      ]
    }
  },
  {
    id: 2,
    name: "Customizable Pizza",
    description: "Create your perfect pizza with a variety of bases, toppings, and extras.",
    category: "Pizzas",
    price: 12.99,
    image: "path/to/pizza.jpg",
    status: "Available",
    options: {
      sizes: [
        { label: "Small", priceModifier: 0 },
        { label: "Medium", priceModifier: 2 },
        { label: "Large", priceModifier: 4 },
        { label: "XL", priceModifier: 6 }
      ],
      crusts: [
        { label: "Original", priceModifier: 0 },
        { label: "Cheddar Crust", priceModifier: 1.5 },
        { label: "Stuffed Crust", priceModifier: 3 }
      ],
      sauces: [
        { label: "Alfredo", priceModifier: 0.5 },
        { label: "Buffalo", priceModifier: 0.7 },
        { label: "BBQ", priceModifier: 0.7 },
        { label: "Ranch", priceModifier: 0.5 }
      ],
      meats: [
        { label: "Grilled Chicken", priceModifier: 1.5 },
        { label: "Bacon", priceModifier: 1.5 },
        { label: "Beef", priceModifier: 1.5 },
        { label: "Sausage", priceModifier: 1.5 },
        { label: "Meat Lover", priceModifier: 2.5 }
      ],
      veggies: [
        { label: "Mushroom", priceModifier: 0.5 },
        { label: "Onion", priceModifier: 0.5 },
        { label: "Pineapple", priceModifier: 0.7 }
      ],
      extras: [
        { label: "Extra Cheese", priceModifier: 1 },
        { label: "Extra Bacon", priceModifier: 1.2 },
        { label: "Extra Sauce", priceModifier: 0.5 }
      ]
    }
  },
  {
    id: 3,
    name: "French Fries",
    description: "Crispy golden fries with your choice of dips.",
    category: "Sides",
    price: 3.99,
    image: "path/to/fries.jpg",
    status: "Available",
    options: {
      sizes: [
        { label: "Small", priceModifier: 0 },
        { label: "Medium", priceModifier: 1 },
        { label: "Large", priceModifier: 2 }
      ],
      dips: [
        { label: "Ketchup", priceModifier: 0 },
        { label: "BBQ Sauce", priceModifier: 0.3 },
        { label: "Ranch", priceModifier: 0.5 }
      ]
    }
  },
  {
    id: 4,
    name: "Soft Drink",
    description: "Chilled carbonated drink.",
    category: "Drinks",
    price: 1.99,
    image: "path/to/drink.jpg",
    status: "Available",
    options: {
      sizes: [
        { label: "Small", priceModifier: 0 },
        { label: "Medium", priceModifier: 0.5 },
        { label: "Large", priceModifier: 1 }
      ],
      flavors: [
        { label: "Cola", priceModifier: 0 },
        { label: "Orange", priceModifier: 0 },
        { label: "Lemon-Lime", priceModifier: 0 }
      ]
    }
  }
];
