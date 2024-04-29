import { expect, test, vi } from "vitest";

import { reactive, effect } from "../src/index.js";
// import { reactive, effect } from '../src/reacitve.js'

test("Map.get", () => {
  const fn = vi.fn();
  const state = reactive(new Map([["name", "bob"]]));

  effect(() => fn(state.get("name")));
  // init
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("bob");

  // set
  state.set("name", "lucy");
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenCalledWith("lucy");
  // set
  state.delete("name");
  expect(fn).toHaveBeenCalledTimes(3);
  expect(fn).toHaveBeenCalledWith(undefined);
});

test("Map.get deep", () => {
  const fn = vi.fn();
  const state = reactive(
    new Map([
      [
        "person",
        {
          name: "bob",
        },
      ],
    ]),
  );

  effect(() => fn(state.get("person").name));

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("bob");

  // state change
  state.get("person").name = "lucy";
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenCalledWith("lucy");
});

test("Map.has", () => {
  const fn = vi.fn();
  const state = reactive(new Map([["name", "bob"]]));

  effect(() => fn(state.has("name")));

  // init
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith(true);

  // set
  state.set("name", "lucy");
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenCalledWith(true);

  // delete
  state.delete("name");
  expect(fn).toHaveBeenCalledTimes(3);
  expect(fn).toHaveBeenCalledWith(false);

  // add
  state.set("name", "john");
  expect(fn).toHaveBeenCalledTimes(4);
  expect(fn).toHaveBeenCalledWith(true);

  // clear
  state.clear();
  expect(fn).toHaveBeenCalledTimes(5);
  expect(fn).toHaveBeenCalledWith(false);
});

test("Map size", () => {
  const fn = vi.fn();
  const state = reactive(new Map([["name", "bob"]]));

  effect(() => fn(state.size));

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith(1);

  // state add
  state.set("age", 18);
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenCalledWith(2);

  // state set
  state.set("name", "lucy");
  expect(fn).toHaveBeenCalledTimes(3);
  expect(fn).toHaveBeenCalledWith(2);

  // state delete
  state.delete("name");
  expect(fn).toHaveBeenCalledTimes(4);
  expect(fn).toHaveBeenCalledWith(1);
});

test("Map.forEach", () => {
  const fn = vi.fn();
  const state = reactive(new Map([["name", "bob"]]));

  effect(() =>
    state.forEach((value, key) => {
      fn(value, key);
    }),
  );
  // init
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("bob", "name");

  // state set
  state.set("name", "lucy");
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenCalledWith("lucy", "name");

  // state add
  state.set("age", 18);
  expect(fn).toHaveBeenCalledTimes(4);
  expect(fn).toHaveBeenNthCalledWith(3, "lucy", "name");
  expect(fn).toHaveBeenNthCalledWith(4, 18, "age");

  // state delete
  state.delete("name");
  expect(fn).toHaveBeenCalledTimes(5);
  expect(fn).toHaveBeenNthCalledWith(5, 18, "age");
});

test("Map.for...of", () => {
  const fn = vi.fn();
  const state = reactive(new Map([["name", "bob"]]));

  effect(() => {
    for (const [key, value] of state) {
      fn(value, key);
    }
  });
  // init
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("bob", "name");

  // state set
  state.set("name", "lucy");
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenCalledWith("lucy", "name");

  // state add
  state.set("age", 18);
  expect(fn).toHaveBeenCalledTimes(4);
  expect(fn).toHaveBeenNthCalledWith(3, "lucy", "name");
  expect(fn).toHaveBeenNthCalledWith(4, 18, "age");

  // state delete
  state.delete("name");
  expect(fn).toHaveBeenCalledTimes(5);
  expect(fn).toHaveBeenNthCalledWith(5, 18, "age");
});

test("Map.keys", () => {
  const fn = vi.fn();
  const state = reactive(new Map([["name", "bob"]]));

  effect(() => {
    for (const key of state.keys()) {
      fn(key);
    }
  });
  // init
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("name");

  // state set
  state.set("name", "lucy");
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenCalledWith("name");

  // state add
  state.set("age", 18);
  expect(fn).toHaveBeenCalledTimes(4);
  expect(fn).toHaveBeenNthCalledWith(3, "name");
  expect(fn).toHaveBeenNthCalledWith(4, "age");

  // state delete
  state.delete("name");
  expect(fn).toHaveBeenCalledTimes(5);
  expect(fn).toHaveBeenNthCalledWith(5, "age");
});
