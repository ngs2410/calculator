var KEY_TYPES = {
  NUM : 'num',
  ADD : 'add',
  SUB : 'sub',
  MUL : 'mul',
  DIV : 'div',
  SQRT : 'sqrt',
  CLR : 'clr',
  EQL : 'eql',
}

Polymer({
  keypad : [
    [ [KEY_TYPES.NUM, '7'],  [KEY_TYPES.NUM, '8'], [KEY_TYPES.NUM, '9'] ],
    [ [KEY_TYPES.NUM, '4'],  [KEY_TYPES.NUM, '5'], [KEY_TYPES.NUM, '6'] ],
    [ [KEY_TYPES.NUM, '1'],  [KEY_TYPES.NUM, '2'], [KEY_TYPES.NUM, '3'] ],
    [ undefined,             [KEY_TYPES.NUM, '0'], undefined ],
    [ [KEY_TYPES.ADD, '+'],  [KEY_TYPES.SUB, '-'], [KEY_TYPES.SQRT, 'SQRT'] ],
    [ [KEY_TYPES.MUL, 'x'],  [KEY_TYPES.DIV, '/'], [KEY_TYPES.CLR, 'CLR'] ],
    [ undefined,             [KEY_TYPES.EQL, '='], undefined ]
  ],
  accumulator: [ "0" ], // Default value
  counterChanged: function() {
    this.$.counterVal.classList.add('highlight');
  },
  increment: function() {
    this.counter++;
  },
  keypress: function(evt, detail, target) {
    var keyType = target.getAttribute('data-key');
    var value = target.getAttribute('data-value');
    if (keyType === KEY_TYPES.NUM) {
      console.log('Pressed number', value);
    } else {
      console.log('Pressed function', keyType);
    }
  }
});