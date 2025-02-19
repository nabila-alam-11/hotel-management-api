const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

initializeDatabase();

const Hotels = require("./models/hotel.models");

async function createHotel(newHotel) {
  try {
    const hotel = new Hotels(newHotel);
    const saveHotel = await hotel.save();
    return saveHotel;
  } catch (error) {
    throw error;
  }
}
// createHotel(newHotel);

app.post("/hotels", async (req, res) => {
  try {
    const saveHotel = await createHotel(req.body);
    res
      .status(201)
      .json({ message: "Hotel added successfully.", Hotel: saveHotel });
  } catch (error) {
    console.log("Error adding hotel: ", error.message);
    res.status(500).json({ error: "Failed to add hotel." });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, Express Server!!");
});

async function readAllHotels() {
  try {
    const hotels = await Hotels.find();
    return hotels;
  } catch (error) {
    throw error;
  }
}
// readAllHotels();

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "Hotels not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

async function readHotelByName(hotelName) {
  try {
    const hotel = await Hotels.findOne({ name: hotelName });
    return hotel;
  } catch (error) {
    throw error;
  }
}
// readHotelByName("Lake View");

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelByName(req.params.hotelName);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel." });
  }
});

async function readHotelsByParkinSpace(isParking) {
  try {
    const hotels = await Hotels.find({ isParkingAvailable: isParking });
    console.log(hotels);
  } catch (error) {
    throw error;
  }
}
// readHotelsByParkinSpace(true)

async function readHotelsWhichHasRestaurant(restaurant) {
  try {
    const hotels = await Hotels.find({ isRestaurantAvailable: restaurant });
    console.log(hotels);
  } catch (error) {
    throw error;
  }
}
// readHotelsWhichHasRestaurant(true);

async function readHotelsByCategory(category) {
  try {
    const hotels = await Hotels.find({ category: category });
    return hotels;
  } catch (error) {
    throw error;
  }
}
// readHotelsByCategory("Mid-Range");

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await readHotelsByCategory(req.params.hotelCategory);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "Hotels not found/" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

async function readAllHotelsByPrice(price) {
  try {
    const hotels = await Hotels.find({ priceRange: price });
    console.log(hotels);
  } catch (error) {
    throw error;
  }
}
// readAllHotelsByPrice("$$$$ (61+)");

async function readAllHotelsByRating(rating) {
  try {
    const hotels = await Hotels.find({ rating: rating });
    return hotels;
  } catch (error) {
    throw error;
  }
}
// readAllHotelsByRating(4.0);

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await readAllHotelsByRating(req.params.hotelRating);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "Hotels not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

async function readHotelByPhoneNumber(phoneNumber) {
  try {
    const hotel = await Hotels.findOne({ phoneNumber: phoneNumber });
    return hotel;
  } catch (error) {
    throw error;
  }
}
// readHotelByPhoneNumber("+1299655890")

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await readHotelByPhoneNumber(req.params.phoneNumber);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "No hotel found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel." });
  }
});

// UPDATE

async function updateHotel(hotelId, dataToUpdate) {
  try {
    const updatedHotel = await Hotels.findByIdAndUpdate(hotelId, dataToUpdate, {
      new: true,
    });
    return updatedHotel;
  } catch (error) {
    console.log("Error in updating hotel check out time:", error);
  }
}
// updateHotel("67984ec0c44193cefeb0c760", {checkOutTime: "11:00 AM"})

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotel(req.params.hotelId);
    if (updatedHotel) {
      res.status(200).json({ message: "Hotel updated successfully." });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update hotel" });
  }
});

async function updateHotelRating(hotelName, dataToUpdate) {
  try {
    const updatedHotel = await Hotels.findOneAndUpdate(
      { name: hotelName },
      dataToUpdate,
      { new: true }
    );
    console.log(updatedHotel);
  } catch (error) {
    console.log("Error in updating rating: ", error);
  }
}
// updateHotelRating("Sunset Resort", {rating: 4.2})

async function updatedHotelNumber(phoneNumber, dataToUpdate) {
  try {
    const updatedHotel = await Hotels.findOneAndUpdate(
      { phoneNumber: phoneNumber },
      dataToUpdate,
      { new: true }
    );
    console.log(updatedHotel);
  } catch (error) {
    console.log("Error in updating hotel number: ", error);
  }
}
// updatedHotelNumber("+1299655890", { phoneNumber: "+1997687392" });

// DELETE

async function deleteHotelById(hotelId) {
  try {
    const deletedHotel = await Hotels.findByIdAndDelete(hotelId);
    console.log(deletedHotel);
  } catch (error) {
    console.log("Error in deleting hotel: ", error);
  }
}

// deleteHotelById("67970350bf0f78e2db145cb7")

async function deleteHotelByPhoneNumber(phoneNumber) {
  try {
    const deletedHotel = await Hotels.findOneAndDelete({
      phoneNumber: phoneNumber,
    });
    console.log(deletedHotel);
  } catch (error) {
    console.log("Error in Hotel deletion: ", error);
  }
}
// deleteHotelByPhoneNumber("+1234555890")

// Update using POSTMAN

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});
