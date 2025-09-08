import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const productsData = [
  {
    title: "Smartphone X1",
    description: "Latest 5G smartphone with AMOLED display",
    category: "Electronics",
    subCategory: "Mobiles",
    images: [
      {
        fileId: "file_elec_001",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/samsumgS1.jpg?updatedAt=1757240096812",
      },
    ],
    sale_price: 699,
    regular_price: 799,
    colors: ["black", "blue"],
    sizes: [],
    stock: 50,
    warranty: "1 year warranty",
  },
  {
    title: "Gaming Laptop Pro",
    description: "High-performance laptop for gamers",
    category: "Electronics",
    subCategory: "Laptops",
    images: [
      {
        fileId: "file_elec_002",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/GamingLaptop.jpeg?updatedAt=1757240095324",
      },
    ],
    sale_price: 1200,
    regular_price: 1500,
    colors: ["black", "yellow"],
    sizes: [],
    stock: 30,
    warranty: "2 year warranty",
  },
  {
    title: "Wireless Earbuds X",
    description: "Noise-cancelling wireless earbuds",
    category: "Electronics",
    subCategory: "Accessories",
    images: [
      {
        fileId: "file_elec_003",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/Earbuds.jpeg?updatedAt=1757240094887",
      },
    ],
    sale_price: 99,
    regular_price: 129,
    colors: ["white", "black"],
    sizes: [],
    stock: 100,
    warranty: "1 year warranty",
  },
  {
    title: "Men's Leather Jacket",
    description: "Stylish winter wear leather jacket",
    category: "Apparel & Fashion",
    subCategory: "Men",
    images: [
      {
        fileId: "file_apparel_002",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/download.jpeg?updatedAt=1757240094777",
      },
    ],
    sale_price: 250,
    regular_price: 300,
    colors: ["red", "black"],
    sizes: ["M", "L", "XL"],
    stock: 60,
    warranty: "1 year warranty",
  },
  {
    title: "Designer Handbag",
    description: "Premium leather handbag for women",
    category: "Apparel & Fashion",
    subCategory: "Bags & Luggage",
    images: [
      {
        fileId: "file_apparel_003",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/download%20(1).jpeg?updatedAt=1757240089884",
      },
    ],
    sale_price: 180,
    regular_price: 220,
    colors: ["red", "black"],
    sizes: [],
    stock: 40,
    warranty: "6 months warranty",
  },
  {
    title: "Cotton Bed Sheet",
    description: "Made of 100% pure cotton with soft finish",
    category: "Clothing & Bedding",
    subCategory: "Bed Sheets",
    images: [
      {
        fileId: "file_bed_001",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/bed-sheet.jpg?updatedAt=1757240363458",
      },
    ],
    sale_price: 40,
    regular_price: 50,
    colors: ["white", "blue"],
    sizes: ["S", "M", "L"],
    stock: 100,
    warranty: "1 year warranty",
  },
  {
    title: "Decorative Curtains",
    description: "Elegant curtains for living room",
    category: "Clothing & Bedding",
    subCategory: "Curtains",
    images: [
      {
        fileId: "file_bed_002",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/download%20(2).jpeg?updatedAt=1757240090058",
      },
    ],
    sale_price: 60,
    regular_price: 80,
    colors: ["yellow", "green"],
    sizes: ["M", "L"],
    stock: 90,
    warranty: "1 year warranty",
  },
  {
    title: "Non-stick Frying Pan",
    description: "Durable and easy to clean frying pan",
    category: "Home & Kitchen",
    subCategory: "Cookware",
    images: [
      {
        fileId: "file_kitchen_001",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/fryingPan.jpeg?updatedAt=1757240095911",
      },
    ],
    sale_price: 25,
    regular_price: 35,
    colors: ["black"],
    sizes: [],
    stock: 200,
    warranty: "2 year warranty",
  },
  {
    title: "LED Table Lamp",
    description: "Energy-efficient modern table lamp",
    category: "Home & Kitchen",
    subCategory: "Lighting",
    images: [
      {
        fileId: "file_kitchen_002",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/download%20(3).jpeg?updatedAt=1757240089980",
      },
    ],
    sale_price: 45,
    regular_price: 65,
    colors: ["white", "black"],
    sizes: [],
    stock: 150,
    warranty: "1 year warranty",
  },
  {
    title: "Yoga Mat Premium",
    description: "Eco-friendly non-slip yoga mat",
    category: "Sports & Fitness",
    subCategory: "Yoga",
    images: [
      {
        fileId: "file_sport_001",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/yogaMat.jpeg?updatedAt=1757240096780",
      },
    ],
    sale_price: 30,
    regular_price: 45,
    colors: ["green", "blue"],
    sizes: [],
    stock: 150,
    warranty: "6 months warranty",
  },
  {
    title: "Mountain Bicycle",
    description: "All-terrain gear mountain bike",
    category: "Sports & Fitness",
    subCategory: "Bicycles",
    images: [
      {
        fileId: "file_sport_002",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/download%20(4).jpeg?updatedAt=1757240089906",
      },
    ],
    sale_price: 350,
    regular_price: 450,
    colors: ["red", "black"],
    sizes: [],
    stock: 40,
    warranty: "2 year warranty",
  },
  {
    title: "Notebook A5",
    description: "100 pages ruled notebook",
    category: "Books & Stationery",
    subCategory: "Notebooks",
    images: [
      {
        fileId: "file_books_001",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/notebook.jpeg?updatedAt=1757240095346",
      },
    ],
    sale_price: 3,
    regular_price: 5,
    colors: ["blue", "yellow"],
    sizes: [],
    stock: 500,
    warranty: "No warranty",
  },
  {
    title: "Fantasy Novel",
    description: "Best-selling fantasy adventure novel",
    category: "Books & Stationery",
    subCategory: "Fiction",
    images: [
      {
        fileId: "file_books_002",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/download%20(5).jpeg?updatedAt=1757240090111",
      },
    ],
    sale_price: 15,
    regular_price: 20,
    colors: [],
    sizes: [],
    stock: 300,
    warranty: "No warranty",
  },
  {
    title: "Face Cream Glow",
    description: "Moisturizing cream for daily use",
    category: "Beauty & Personal Care",
    subCategory: "Skincare",
    images: [
      {
        fileId: "file_beauty_001",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/faceCream.jpeg?updatedAt=1757240095331",
      },
    ],
    sale_price: 15,
    regular_price: 20,
    colors: [],
    sizes: [],
    stock: 300,
    warranty: "6 months warranty",
  },
  {
    title: "Perfume Elite",
    description: "Long-lasting fragrance for men and women",
    category: "Beauty & Personal Care",
    subCategory: "Fragrances",
    images: [
      {
        fileId: "file_beauty_002",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/download%20(6).jpeg?updatedAt=1757240090056",
      },
    ],
    sale_price: 60,
    regular_price: 80,
    colors: [],
    sizes: [],
    stock: 120,
    warranty: "No warranty",
  },
  {
    title: "Baby Stroller Lite",
    description: "Lightweight stroller for infants",
    category: "Toys & Baby Products",
    subCategory: "Baby Gear",
    images: [
      {
        fileId: "file_baby_001",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/stroller.jpeg?updatedAt=1757240096117",
      },
    ],
    sale_price: 120,
    regular_price: 150,
    colors: ["red", "blue"],
    sizes: [],
    stock: 70,
    warranty: "1 year warranty",
  },
  {
    title: "Building Blocks Set",
    description: "Colorful educational building blocks",
    category: "Toys & Baby Products",
    subCategory: "Educational Toys",
    images: [
      {
        fileId: "file_baby_002",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/download%20(7).jpeg?updatedAt=1757240090187",
      },
    ],
    sale_price: 40,
    regular_price: 55,
    colors: ["red", "green", "yellow"],
    sizes: [],
    stock: 200,
    warranty: "No warranty",
  },
  {
    title: "Car Vacuum Cleaner",
    description: "Portable vacuum cleaner for cars",
    category: "Automotive",
    subCategory: "Car Accessories",
    images: [
      {
        fileId: "file_auto_001",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/carCleanner.jpeg?updatedAt=1757240089693",
      },
    ],
    sale_price: 45,
    regular_price: 60,
    colors: ["black", "green"],
    sizes: [],
    stock: 120,
    warranty: "1 year warranty",
  },
  {
    title: "Olive Oil Extra Virgin",
    description: "Organic cold-pressed olive oil",
    category: "Groceries",
    subCategory: "Oils & Lubricants",
    images: [
      {
        fileId: "file_grocery_001",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/download%20(8).jpeg?updatedAt=1757240090118",
      },
    ],
    sale_price: 12,
    regular_price: 15,
    colors: [],
    sizes: [],
    stock: 400,
    warranty: "No warranty",
  },
  {
    title: "Dog Food Pack",
    description: "Nutritious dry food for dogs",
    category: "Pet Supplies",
    subCategory: "Pet Food",
    images: [
      {
        fileId: "file_pet_001",
        file_url:
          "https://ik.imagekit.io/aalam855/MyMedia/dogFood.jpeg?updatedAt=1757240089668",
      },
    ],
    sale_price: 25,
    regular_price: 35,
    colors: [],
    sizes: [],
    stock: 250,
    warranty: "No warranty",
  },
];

const seedProducts = async () => {
  try {
    console.log("Starting product seeding...");

    const createdProducts = [];

    for (let i = 0; i < productsData.length; i++) {
      const productData = productsData[i];

      try {
        const newProduct = await prisma.product.create({
          data: {
            title: productData.title,
            description: productData.description,
            category: productData.category,
            subCategory: productData.subCategory,
            images: {
              create: productData.images
                .filter((img) => img && img.fileId && img.file_url)
                .map((image) => ({
                  file_id: image.fileId,
                  url: image.file_url,
                })),
            },
            colors: productData.colors || [],
            sizes: productData.sizes || [],
            stock: productData.stock,
            sale_price: productData.sale_price,
            regular_price: productData.regular_price,
            warranty: productData.warranty,
          },
          include: {
            images: true,
          },
        });

        createdProducts.push(newProduct);
        console.log(`✅ Created product ${i + 1}: ${productData.title}`);
      } catch (productError) {
        console.error(
          `❌ Failed to create product ${i + 1}: ${productData.title}`,
          productError
        );
      }
    }

    console.log(
      `🎉 Successfully created ${createdProducts.length} out of ${productsData.length} products`
    );
    return createdProducts;
  } catch (error) {
    console.error("❌ Error during product seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const runner = () => {
  seedProducts();
};

runner();
