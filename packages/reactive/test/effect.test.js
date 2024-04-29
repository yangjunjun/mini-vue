import { expect, test, vi } from "vitest";

import { effect, reactive } from "../src/index.js";

test("01.effect: fn is called", () => {
  const fn = vi.fn();
  effect(fn);
  expect(fn).toBeCalled();
});

test("02.effect nest effect", () => {
  const fn1 = vi.fn();
  const fn2 = vi.fn();
  const fn3 = vi.fn();
  const state = reactive({
    foo: "foo",
    bar: "bar",
    baz: "baz",
  });
  effect(() => {
    fn1(state.foo);
    effect(() => {
      fn2(state.bar);
    });
    fn3(state.baz);
  });
  // init
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(fn1).toHaveBeenCalledWith("foo");
  expect(fn2).toHaveBeenCalledTimes(1);
  expect(fn2).toHaveBeenCalledWith("bar");
  expect(fn3).toHaveBeenCalledTimes(1);
  expect(fn3).toHaveBeenCalledWith("baz");
  // change 1
  state.bar = "bar2";
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(fn1).toHaveBeenCalledWith("foo");
  expect(fn2).toHaveBeenCalledTimes(2);
  expect(fn2).toHaveBeenCalledWith("bar2");
  expect(fn3).toHaveBeenCalledTimes(1);
  expect(fn3).toHaveBeenCalledWith("baz");
  // change 2
  state.baz = "baz2";
  expect(fn1).toHaveBeenCalledTimes(2);
  expect(fn1).toHaveBeenCalledWith("foo");
  expect(fn2).toHaveBeenCalledTimes(3);
  expect(fn2).toHaveBeenCalledWith("bar2");
  expect(fn3).toHaveBeenCalledTimes(2);
  expect(fn3).toHaveBeenCalledWith("baz2");
});
