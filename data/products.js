const products = [
  {
    villa: [
      {
        name: "tasmania resort room 01",
        image: "/images/tasmania-resort-01.jpg",
        category: "villa",
        type: "farm view villa",
        maxPeople: 4,
        roomNums: 2,
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
        price: 189.99,
        countInStock: 3,
        rating: 4.5,
        numReviews: 12,
      },
      {
        name: "tasmania resort room 02",
        image: "/images/tasmania-resort-02.jpg",
        category: "villa",
        type: "ocean view villa",
        maxPeople: 2,
        roomNums: 2,
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
        price: 199.99,
        countInStock: 3,
        rating: 4.5,
        numReviews: 12,
      },
    ],
  },
  {
    food: [
      {
        name: "tasmania food - seafood 01",
        image: "/images/tasmania-food.jpg",
        category: "food",
        type: "seafood",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
        price: 29.99,
        countInStock: 50,
        rating: 4.5,
        numReviews: 12,
      },
      {
        name: "tasmania food - seafood 02",
        image: "/images/tasmania-food.jpg",
        category: "food",
        type: "seafood",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
        price: 39.99,
        countInStock: 0,
        rating: 5,
        numReviews: 12,
      },
    ],
  },
  {
    specialty: [
      {
        name: "tasmania specialty honey",
        image: "/images/tasmania-honey.jpg",
        category: "specialty",
        type: "honey",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
        price: 19.99,
        countInStock: 50,
        rating: 4,
        numReviews: 12,
      },
      {
        name: "tasmania specialty cheese",
        image: "/images/tasmania-honey.jpg",
        category: "specialty",
        type: "cheese",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
        price: 9.99,
        countInStock: 10,
        rating: 4,
        numReviews: 12,
      },
    ],
  },
  {
    travel: [
      {
        name: "tasmania travel bruny",
        image: "/images/tasmania-travel-bruny.jpg",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
        brand: "tasmania resort",
        category: "travel",
        type: "island",
        duration: "one day tour",
        attractions: {
          name: "bruny island",
          briefInfo:
            "We start from our farm morning 9:00am,then we go ahead to bruny island...",
        },
        price: 210.0,
        countInStock: 20,
        rating: 4.5,
        numReviews: 10,
      },
      {
        name: "tasmania travel cradle MT and farm tour",
        image: ["/images/tasmania-travel-cradleMT.jpg"],
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
        brand: "tasmania resort",
        category: "travel",
        type: "hiking",
        duration: "two days tour",
        attractions: {
          name: " fram tour",
          briefInfo: "Today,we are going to join the farm tour....",
        },
        price: 420.0,
        countInStock: 10,
        rating: 4.5,
        numReviews: 10,
      },
    ],
  },
];

export default products;
