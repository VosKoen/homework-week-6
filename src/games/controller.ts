import {
  JsonController,
  Get,
  HttpCode,
  Body,
  Post,
  BadRequestError
} from "routing-controllers";
import Game from "./entity";

@JsonController()
export default class GameController {
  @Get("/games")
  async allGames() {
    const games = await Game.find();
    return { games };
  }

  @Post("/games")
  @HttpCode(201)
  createGame(@Body() game: Partial<Game>) {
    const { name } = game;
    if (!game)
      throw new BadRequestError("Bad request, please update your request");
    if (!name) throw new BadRequestError("A new game should have a name");

    const color = pickRandomColor();

    const entity = Game.create({ name, color });
    return entity.save();
  }
}

const pickRandomColor = () => {
  const randomizer = Math.floor(Math.random() * 5);
  switch (randomizer) {
    case 0:
      return "red";
    case 1:
      return "blue";
    case 2:
      return "green";
    case 3:
      return "yellow";
    case 4:
      return "magenta";
    default:
      return "Something went wrong with the color picker";
  }
};
