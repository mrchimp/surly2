/**
 * Stack for holding stuff.
 * Based on code from my cmd.js
 *
 * @author   Jake Gully, chimpytk@gmail.com
 * @license  MIT License
 */

/**
 * Constructor
 * @param {integer} max_size Number of commands to store
 */
export default class Stack {
  constructor (max_size) {
    this.arr = []; // This is a fairly meaningless name but
    // makes it sound like this function was
    // written by a pirate.  I'm keeping it.

    if (typeof max_size !== 'number') {
      throw 'Stack error: max_size should be a number.';
    }

    this.max_size = max_size;
  }

  /**
  * Push an item to the array
  * @param  {string} item Item to append to stack
  */
  push (item) {
    this.arr.push(item);

    // crop off excess
    while (this.arr.length > this.max_size) {
      this.arr.shift();
    }
  }

  /**
  * Get an item by it's index.
  * @return {Integer}
  */
  get (index) {
    if (index < 1) {
      var item = this.arr.slice(index)[0];

      return item || false;
    }

    if (typeof this.arr[index] === 'undefined') {
      return false;
    }

    return this.arr[index];
  }

  /**
  * Return the last item on the stack.
  * @return {Various} Item
  */
  getLast () {
    if (this.isEmpty()) {
      return false;
    }

    return this.arr[this.arr.length - 1];
  }

  /**
  * Is stack empty
  * @return {Boolean} True if stack is empty
  */
  isEmpty () {
    return (this.arr.length === 0);
  }

  /**
  * Empty array and remove from localstorage
  */
  empty () {
    this.arr = [];
  }

  /**
  * Get entire stack array
  * @return {array} The stack array
  */
  getArr () {
    return this.arr;
  }

  /**
  * Get size of the stack
  * @return {Integer} Size of stack
  */
  getSize () {
    return this.arr.size;
  }
};
