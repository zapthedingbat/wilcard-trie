function Node(keyPart, wildcard, value) {
  this.keyPart = keyPart;
  this.wildcard = wildcard;
  this.children = new Map();
  this.value = value;
}

Node.prototype.match = function(key) {
  if (this.wildcard === undefined) {
    return key;
  } else if (this.wildcard === "") {
    if (key.startsWith(this.keyPart)) {
      return key.slice(this.keyPart.length);
    }
    return null;
  } else if (this.wildcard === "*") {
    const index = key.indexOf(this.keyPart);
    if (index === -1) {
      return null;
    }
    return key.slice(index + this.keyPart.length);
  }
};

Node.prototype.find = function(key) {
  let subKey = this.match(key);
  if (subKey != null) {
    if (this.children.size === 0) {
      return this;
    } else {
      let children = Array.from(this.children.values());
      for (const child of children) {
        let subChild = child.find(subKey);
        if (subChild) {
          return subChild;
        }
      }
    }
  }
  return undefined;
};

Node.prototype.insert = function(keyPart, wildcard) {
  let child;
  if (this.children.has(keyPart)) {
    child = this.children.get(keyPart);
  } else {
    child = new Node(keyPart, wildcard);
    this.children.set(keyPart, child);
  }
  return child;
};

Node.prototype.print = function(depth) {
  if (this.wildcard === undefined) {
    console.log("Trie");
  } else {
    const padding = "..".repeat(depth);
    const value = this.children.size === 0 ? `: ${this.value}` : "";
    console.log(`${padding} ${this.wildcard} "${this.keyPart}"${value}`);
  }
  for (const child of this.children.values()) {
    child.print(depth + 1);
  }
};

function createTrie() {
  const rootNode = new Node();

  const get = key => {
    const r = rootNode.find(key);
    return r ? r.value : undefined;
  };

  const add = (key, value) => {
    const wildcardPattern = /\*+/g;
    let parentNode = rootNode;
    let wildcardMatch;
    let wildcard = "";
    let previousIndex = 0;
    while ((wildcardMatch = wildcardPattern.exec(key))) {
      const start = previousIndex;
      const end = wildcardMatch.index;
      const keyPart = key.slice(start, end);
      parentNode = parentNode.insert(keyPart, wildcard);
      wildcard = wildcardMatch[0];
      previousIndex = wildcardPattern.lastIndex;
    }
    const keyPart = key.slice(previousIndex);
    parentNode = parentNode.insert(keyPart, wildcard);
    parentNode.value = value;
  };

  return {
    add,
    get,
    rootNode
  };
}

module.exports = exports = {
  createTrie
};
