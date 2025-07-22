import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
    const pokemons = response.data.results;

    const detailedPokemon = pokemons.map(async (pokemon) => {
      const detailResponse = await axios.get(pokemon.url);
      const data = detailResponse.data;
      return {
        id:data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        types: data.types.map(t => t.type.name),
      };
    });

    const detailedPokemons = await Promise.all(detailedPokemon);

    res.render("index.ejs", { pokemons: detailedPokemons });

  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
      pokemons: [],
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
