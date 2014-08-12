// These constants define the kinds of keys that we recognize in the keypad
var KEY_TYPES = {
  NUM : 'num',
  DOT : 'dot',
  ADD : 'add',
  SUB : 'sub',
  MUL : 'mul',
  DIV : 'div',
  SQRT : 'sqrt',
  CLR : 'clr',
  EQL : 'eql',
}

// Here we map from the currentOperation to the legend that we would use for that operation
// and the function that the operation carries out
var OPERATIONS = {
  add : { legend : '+', op: function(a,b) { return b+a } },
  sub : { legend : '-', op: function(a,b) { return b-a } },
  mul : { legend : 'x', op: function(a,b) { return b*a } },
  div : { legend : '/', op: function(a,b) { return b/a } }
}

// By convention real world calculators have rules to determine when a number key press extends
// the currently displayed number or starts a new number - we need to model that and use these
// states
var STATES = {
  INPUT : 'input',
  RESULT : 'result'
}

var ZERO_STRING = "0";
var DEFAULT_DISPLAY = [ ZERO_STRING ];
var MAX_PRECISION = 10;
var ROWS_TO_DISPLAY = 2;

Polymer({
  // This nested array defines the layout and functionality of keys on the keypad
  // Each tuple is the function of the key and the legend for that key
  // 'undefined' places an empty space in the layout
  keypad : [
    [ [KEY_TYPES.NUM, '7'],  [KEY_TYPES.NUM, '8'], [KEY_TYPES.NUM, '9'] ],
    [ [KEY_TYPES.NUM, '4'],  [KEY_TYPES.NUM, '5'], [KEY_TYPES.NUM, '6'] ],
    [ [KEY_TYPES.NUM, '1'],  [KEY_TYPES.NUM, '2'], [KEY_TYPES.NUM, '3'] ],
    [ [KEY_TYPES.DOT, '.'],  [KEY_TYPES.NUM, '0'], undefined ],
    [ [KEY_TYPES.ADD, '+'],  [KEY_TYPES.SUB, '-'], [KEY_TYPES.SQRT, 'SQRT'] ],
    [ [KEY_TYPES.MUL, 'x'],  [KEY_TYPES.DIV, '/'], [KEY_TYPES.CLR, 'CLR'] ],
    [ undefined,             [KEY_TYPES.EQL, '='], undefined ]
  ],

  // This is the state the calculator is in (input or result) so we know what to do
  // when a key is pressed.
  state : STATES.INPUT,

  // The accumulator holds results from prior operations and the number being entered
  //
  accumulator: DEFAULT_DISPLAY,

  // These helper functions allow us to operate on the accumulator and help abstract out
  // the type of the information held in the accumulator (String vs Number)
  examine: function () {
    return parseFloat(this.accumulator[0]);
  },
  pop: function () {
    var a = this.accumulator.shift();
    return parseFloat(a);
  },
  push: function (v) {
    this.accumulator.unshift(v.toString());
  },
  newline: function () {
    if (this.state === STATES.RESULT) {
      this.push(ZERO_STRING);
      this.state = STATES.INPUT;
    }
  },

  // Polymer needs a helper to notice when an array (the accumulator) changes
  //
  kick: 0,
  accumulatorChanged: function() {
    this.kick++;
  },

  // These computed properties help us translate elements of the view model into
  // data to be rendered in the templates in the view
  //
  computed: {
    todisplay : 'sliced(accumulator, kick)',
    oplegend : 'legend(currentOperation)'
  },
  sliced: function(accumulator) {
    return accumulator.slice(0, ROWS_TO_DISPLAY).reverse().map(function (v) {
      return parseFloat(parseFloat(v).toPrecision(MAX_PRECISION));
    });
  },
  legend : function (cf) {
    return cf ? OPERATIONS[cf].legend : '';
  },

  // We need to remember the current operation (add, sub, mul, div) when the user
  // presses one of those keys and then be able to operate on the numbers in the accumulator
  // when equals is pressed of another operator is invoked.
  currentOperation: undefined,
  performCurrentOperation: function () {
    if (this.currentOperation && this.accumulator.length >= 2) {
      var a = this.pop();
      var b = this.pop();
      var c = OPERATIONS[this.currentOperation].op(a, b);
      this.push(c);
    }
    this.state = STATES.RESULT;
  },

  // This function handles all keypresses
  keypress: function(evt, detail, target) {
    // First off, we get the type and value of the key pressed
    var keyType = target.getAttribute('data-key');
    var value = target.getAttribute('data-value');

    if (keyType === KEY_TYPES.NUM) {
      // If it's a 'number' key then we add a new line if we're in the result state
      //
      this.newline();
      this.accumulator[0] = (this.accumulator[0]) == ZERO_STRING ? value : this.accumulator[0] + value;

    } else {
      // If it's a 'function' key then we match on the function type and carry out the operation
      //
      switch (keyType) {
        case KEY_TYPES.DOT:
          this.newline();
          if (this.accumulator[0].indexOf('.') === -1) {
            this.accumulator[0] = this.accumulator[0] + '.';            
          }
          break;

        case KEY_TYPES.ADD:
        case KEY_TYPES.SUB:
        case KEY_TYPES.MUL:
        case KEY_TYPES.DIV:
          // As all our arithmetic operations are binary (i.e. work on two numbers), we have
          // to first complete the prior operation (if any) before starting a new one. 
          this.performCurrentOperation();

          // Then we update our understanding of what the current operation is and add a new input line
          // to the display
          this.currentOperation = keyType;
          this.newline();
          break;

        case KEY_TYPES.EQL:
          this.performCurrentOperation();
          break;

        case KEY_TYPES.SQRT:
          // Our calculator only handles real numbers and so the square root operation
          // is limited to positive numbers.
          // TODO: Flag an error if the user presses SQRT on a negative number
          if (this.examine() >= 0) {
            this.push(Math.sqrt(this.pop()));
            this.state = STATES.RESULT;
          }
          break;

        case KEY_TYPES.CLR:
          // Polymer doesn't seem to notice a reassignment to this.accumulator
          // so for now, we slice is back to 1 element and put a new value in that element.
          this.accumulator = this.accumulator.slice(0,1);
          this.accumulator[0] = ZERO_STRING;
          break;

        default:
          console.error('Unrecognized key: key =', keyType, 'value =', value);
      }
    }
  }
});