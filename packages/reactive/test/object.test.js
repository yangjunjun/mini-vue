import { expect, test, vi } from "vitest";

import { reactive, effect } from "../src/index.js";

test("01.basic", () => {
  const fn = vi.fn();
  const state = reactive({
    msg: "hello",
  });

  // init
  effect(() => {
    fn(state.msg);
  });
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("hello");

  // state change
  state.msg = "world";
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith("world");
});

test("02.multiple effect", () => {
  const fn1 = vi.fn();
  const fn2 = vi.fn();

  const state = reactive({
    msg: "hello",
  });

  effect(() => {
    fn1(state.msg);
  });
  effect(() => {
    fn2(state.msg);
  });
  // init
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(fn1).toHaveBeenCalledWith("hello");

  expect(fn2).toHaveBeenCalledTimes(1);
  expect(fn2).toHaveBeenCalledWith("hello");

  // state change
  state.msg = "world";
  expect(fn1).toHaveBeenCalledTimes(2);
  expect(fn1).toHaveBeenCalledWith("world");

  expect(fn2).toHaveBeenCalledTimes(2);
  expect(fn2).toHaveBeenCalledWith("world");
});

test("03.multiple state in one effect", () => {
  const fn = vi.fn();
  const state = reactive({
    foo: "foo",
    bar: "bar",
  });

  // init
  effect(() => {
    fn(state.foo, state.bar);
  });
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("foo", "bar");

  // state change
  state.foo = "foo1";
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith("foo1", "bar");

  // state change
  state.bar = "bar1";
  expect(fn).toHaveBeenCalledTimes(3);
  expect(fn).toHaveBeenLastCalledWith("foo1", "bar1");
});

test("04.one state multiple get", () => {
  const fn1 = vi.fn();
  const fn2 = vi.fn();
  const state = reactive({
    msg: "hello",
  });

  // init
  effect(() => {
    fn1(state.msg);
    fn2(state.msg);
  });
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(fn1).toHaveBeenCalledWith("hello");
  expect(fn2).toHaveBeenCalledTimes(1);
  expect(fn2).toHaveBeenCalledWith("hello");

  // state change
  state.msg = "world";
  expect(fn1).toHaveBeenCalledTimes(2);
  expect(fn1).toHaveBeenCalledWith("world");
  expect(fn2).toHaveBeenCalledTimes(2);
  expect(fn2).toHaveBeenCalledWith("world");
});

test("05.getter", () => {
  const fn = vi.fn();

  const state = reactive({
    text: "hello",
    get msg() {
      return this.text;
    },
  });

  // init
  effect(() => {
    fn(state.msg);
  });
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("hello");

  // state change
  state.text = "world";
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith("world");
});

test("06.getter & setter", () => {
  const fn = vi.fn();

  const state = reactive({
    text: "hello",
    get msg() {
      return this.text;
    },
    set msg(value) {
      this.text = value;
    },
  });

  // init
  effect(() => {
    fn(state.msg);
  });
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("hello");

  // change twice
  state.msg = "world";
  expect(fn).toHaveBeenCalledTimes(3);
  expect(fn).toHaveBeenLastCalledWith("world");
});

test("07.avoid infinite effect", () => {
  const fn = vi.fn();
  const state = reactive({
    num: 0,
  });

  // init
  effect(() => {
    fn(state.num++);
  });
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith(0);

  // state change
  state.num = 1;
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith(1);
});

test("08.branch", () => {
  const fn1 = vi.fn();
  const fn2 = vi.fn();
  const state = reactive({
    flag: false,
    msg: "hello",
  });

  // init
  effect(() => {
    fn1(state.flag);
    if (state.flag) {
      fn2(state.msg);
    }
  });
  // init
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(fn1).toHaveBeenCalledWith(false);
  expect(fn2).toHaveBeenCalledTimes(0);

  // msg change
  state.msg = "world";
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(fn2).toHaveBeenCalledTimes(0);

  // flag change to true
  state.flag = true;
  expect(fn1).toHaveBeenCalledTimes(2);
  expect(fn1).toHaveBeenCalledWith(true);
  expect(fn2).toHaveBeenCalledTimes(1);
  expect(fn2).toHaveBeenCalledWith("world");

  // msg change
  state.msg = "vue";
  expect(fn1).toHaveBeenCalledTimes(3);
  expect(fn1).toHaveBeenCalledWith(true);
  expect(fn2).toHaveBeenCalledTimes(2);
  expect(fn2).toHaveBeenCalledWith("vue");
});

test("09.deep", () => {
  const fn = vi.fn();
  const state = reactive({
    person: {
      name: "bob",
    },
  });

  // init
  effect(() => {
    fn(state.person.name);
  });
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("bob");

  // state change
  state.person.name = "john";
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith("john");
});

test("10.iterate", () => {
  const fn = vi.fn();
  const state = reactive({
    foo: "foo",
  });

  // init
  effect(() => {
    fn(Object.keys(state));
  });
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith(["foo"]);

  // add key "bar"
  state.bar = "bar";
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith(["foo", "bar"]);

  // set key "bar"
  state.bar = "bar02";
  expect(fn).toHaveBeenCalledTimes(2);

  // set key "bar"
  delete state.bar;
  expect(fn).toHaveBeenCalledTimes(3);
  expect(fn).toHaveBeenLastCalledWith(["foo"]);
});
