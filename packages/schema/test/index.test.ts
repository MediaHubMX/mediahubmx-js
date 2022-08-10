import jest from "@jest/globals";
import { getClientValidators, getServerValidators } from "../src";

const movie = () => ({
  type: "movie",
  ids: { some: "id" },
});

const directory = () => ({
  type: "directory",
  id: null,
});

// const catalogResponse = () => ({
//   items: [movie(), directory()],
//   nextCursor: null,
// });

jest.test("Validate movie item", () => {
  jest.expect(getServerValidators().models.item.movie(movie())).toBeTruthy();
  jest.expect(getClientValidators().models.item.movie(movie())).toBeTruthy();
});

jest.test("Validate directory item with null as id", () => {
  jest
    .expect(getServerValidators().models.item.directory(directory()))
    .toBeTruthy();
  jest
    .expect(getClientValidators().models.item.directory(directory()))
    .toBeTruthy();
});

// test("Validate catalog response", () => {
//   expect(
//     getServerValidators().actions.catalog.response(catalogResponse())
//   ).toBeTruthy();
//   expect(
//     getClientValidators().actions.catalog.response(catalogResponse())
//   ).toBeTruthy();
// });
