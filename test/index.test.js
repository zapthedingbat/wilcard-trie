const { createTrie } = require("../src/index");
const assert = require("assert");

describe("Trie", function() {
  let trie;
  beforeEach(function() {
    trie = createTrie();
  });

  describe("match", function() {
    it("should return the accociated value when present", function() {
      trie.add("key", "value");
      assert.equal(trie.get("key"), "value");
    });
  });

  describe("non-match", function() {
    it("should not return a value when not present", function() {
      trie.add("key", "value");
      trie.add("*key", "value");
      trie.add("key*", "value");
      trie.add("k*y", "value");
      assert.equal(trie.get("non-matching"), undefined);
    });
  });

  describe("wildcard", function() {
    it("should return the accociated value when present", function() {
      trie.add("one*two*three", "1");
      assert.equal(trie.get("onexxxtwoxxxxthree"), "1");
    });
  });

  describe("leading wildcard", function() {
    it("should return the accociated value when present", function() {
      trie.add("*one*two*three", "1");
      assert.equal(trie.get("onexxxtwoxxxxthree"), "1");
    });
  });

  describe("trailing wildcard", function() {
    it("should return the accociated value when present", function() {
      trie.add("one*two*three*", "1");
      assert.equal(trie.get("onexxxtwoxxxxthree"), "1");
    });
  });
});
