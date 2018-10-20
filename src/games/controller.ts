import {
  JsonController,
  Get,
  HttpCode,
  Body,
  Post,
  BadRequestError,
  NotFoundError,
  Param,
  Put
} from "routing-controllers";
import Game from "./entity";

const board = [
	['o', 'o', 'o'],
	['o', 'o', 'o'],
	['o', 'o', 'o']
]

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
    if (!name) throw new BadRequestError("A new game should have a name");

    const color = pickRandomColor();

    const newGame = Game.create({ name, color, board });
    return newGame.save();
  }

  @Put("/games/:id")
  async updateGame(@Param("id") id: number, @Body() update: Partial<Game>) {
    const game = await Game.findOne(id);
    if (!game) throw new NotFoundError("Cannot find game");

    if (update.id && update.id !== game.id) throw new BadRequestError("It is not possible to change the game id.");

    if (update.board) {
      if(getNumberOfMoves(game.board,update.board) > 1) throw new BadRequestError("Only one move per turn is allowed.");
    }

    if (update.color && !validateColor(update.color.toLowerCase())) throw new BadRequestError("The requested color is not defined as a valid color.") ;
   
    return Game.merge(game, update).save();
  }
}

const getNumberOfMoves = (board1: [], board2: []) => {
  const moves = (board1, board2) => 
  board1
    .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
    .reduce((a, b) => a.concat(b))
    .length

  return moves
}

const validateColor = (color) => {
  console.log(color)
  if (color !== "red" && color !== "blue" && color !== "green" && color !== "yellow" && color !== "magenta") return false;
  return true;
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
