import { expect, test, vi } from "vitest";

import { ref, effect } from "../src/index.js";

test("ref basic", () => {
  const fn = vi.fn();
  const flag = ref(false);
  //
  // init
  effect(() => fn(flag.value));

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith(false);

  // state change
  flag.value = true;
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenCalledWith(true);
});
